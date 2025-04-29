import { firestore } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';

// Interfaces
export interface IKQuestion {
  id?: string;
  userId: string;
  userName?: string;  // Gönderen kişinin adı
  userEmail?: string; // Gönderen kişinin emaili
  userPhotoURL?: string; // Gönderen kişinin profil fotoğrafı
  title: string;
  description: string;
  attachments?: string[];
  category?: string;
  status: 'pending' | 'answered' | 'solved';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedExpertId?: string;
  monthlyQuestionCount: number;
  lastAnswerId?: string;
}

export interface IKAnswer {
  id?: string;
  questionId: string;
  userId: string;
  content: string;
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isRead: boolean;
  isExpert: boolean;
  replyToAnswerId?: string;
}

// Constants
export const IK_CATEGORIES = [
  'Bordro',
  'İzin',
  'Özlük İşlemleri',
  'Yan Haklar',
  'Diğer'
] as const;

export type IKCategory = typeof IK_CATEGORIES[number];

const MONTHLY_QUESTION_LIMIT = 3;

// Service Class
class IKHelpService {
  private questionsRef = collection(firestore, 'ikQuestions');
  private answersRef = collection(firestore, 'ikAnswers');
  private usersRef = collection(firestore, 'users');

  // Kullanıcı bilgilerini getir
  private async getUserInfo(userId: string) {
    try {
      const userDoc = await getDoc(doc(this.usersRef, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          userName: userData.displayName || userData.name || 'İsimsiz Kullanıcı',
          userEmail: userData.email || null,
          userPhotoURL: userData.photoURL || null
        };
      }
      return {
        userName: 'İsimsiz Kullanıcı',
        userEmail: null,
        userPhotoURL: null
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return {
        userName: 'İsimsiz Kullanıcı',
        userEmail: null,
        userPhotoURL: null
      };
    }
  }

  // Soru ekleme
  async addQuestion(data: Omit<IKQuestion, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'monthlyQuestionCount' | 'userName' | 'userEmail' | 'userPhotoURL'>) {
    try {
      // Kullanıcının bu ayki soru sayısını kontrol et
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const userQuestionsQuery = query(
        this.questionsRef,
        where('userId', '==', data.userId),
        where('createdAt', '>=', monthStart),
        where('createdAt', '<=', monthEnd)
      );

      const userQuestions = await getDocs(userQuestionsQuery);
      
      if (userQuestions.size >= MONTHLY_QUESTION_LIMIT) {
        throw new Error(`Aylık soru limitine ulaştınız (${MONTHLY_QUESTION_LIMIT} soru)`);
      }

      // Kullanıcı bilgilerini al
      const userInfo = await this.getUserInfo(data.userId);

      const questionData = {
        ...data,
        userName: userInfo.userName,
        userEmail: userInfo.userEmail,
        userPhotoURL: userInfo.userPhotoURL,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        monthlyQuestionCount: userQuestions.size + 1
      };

      const docRef = await addDoc(this.questionsRef, questionData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  // Yanıt ekleme (hem kullanıcı hem uzman için)
  async addAnswer(data: Omit<IKAnswer, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>): Promise<string> {
    try {
      // Önce sorunun var olduğunu ve durumunu kontrol et
      const questionRef = doc(this.questionsRef, data.questionId);
      const questionSnap = await getDoc(questionRef);
      
      if (!questionSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      const questionData = questionSnap.data() as IKQuestion;
      if (questionData.status === 'solved') {
        throw new Error('Bu soru çözüldü olarak işaretlenmiş');
      }

      // Yanıtı ekle
      const answerData: Omit<IKAnswer, 'id'> = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isRead: false
      };

      const answerRef = await addDoc(this.answersRef, answerData);

      // Sorunun durumunu ve son yanıt ID'sini güncelle
      await updateDoc(questionRef, {
        status: 'answered',
        updatedAt: serverTimestamp(),
        lastAnswerId: answerRef.id
      });

      return answerRef.id;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  // Soruyu çözüldü olarak işaretle (sadece uzman)
  async markQuestionAsSolved(questionId: string, expertId: string): Promise<void> {
    try {
      const questionRef = doc(this.questionsRef, questionId);
      const questionSnap = await getDoc(questionRef);
      
      if (!questionSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      await updateDoc(questionRef, {
        status: 'solved',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking question as solved:', error);
      throw error;
    }
  }

  // Soruyu tekrar aç (sadece kullanıcı)
  async reopenQuestion(questionId: string, userId: string): Promise<void> {
    try {
      const questionRef = doc(this.questionsRef, questionId);
      const questionSnap = await getDoc(questionRef);
      
      if (!questionSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      const questionData = questionSnap.data() as IKQuestion;
      if (questionData.userId !== userId) {
        throw new Error('Bu soruyu tekrar açma yetkiniz yok');
      }

      await updateDoc(questionRef, {
        status: 'answered',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error reopening question:', error);
      throw error;
    }
  }

  // Kullanıcının sorularını getirme
  async getUserQuestions(userId: string) {
    try {
      const q = query(
        this.questionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IKQuestion[];
    } catch (error) {
      console.error('Error getting user questions:', error);
      throw error;
    }
  }

  // Soru detayını getirme
  async getQuestionById(questionId: string) {
    try {
      const docRef = doc(this.questionsRef, questionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as IKQuestion;
    } catch (error) {
      console.error('Error getting question:', error);
      throw error;
    }
  }

  // Sorunun cevaplarını getirme
  async getQuestionAnswers(questionId: string) {
    try {
      const q = query(
        this.answersRef,
        where('questionId', '==', questionId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IKAnswer[];
    } catch (error) {
      console.error('Error getting answers:', error);
      throw error;
    }
  }

  // Cevabı okundu olarak işaretleme
  async markAnswerAsRead(answerId: string) {
    try {
      const answerRef = doc(this.answersRef, answerId);
      await updateDoc(answerRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking answer as read:', error);
      throw error;
    }
  }

  // Admin: Tüm soruları getirme
  async getAllQuestions() {
    try {
      const q = query(this.questionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      // Tüm soruları al ve kullanıcı bilgilerini ekle
      const questions = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const questionData = doc.data();
          
          // Eğer kullanıcı bilgileri eksikse, tekrar getir
          if (!questionData.userName || !questionData.userEmail) {
            const userInfo = await this.getUserInfo(questionData.userId);
            if (userInfo) {
              // Firestore'da kullanıcı bilgilerini güncelle
              await updateDoc(doc.ref, {
                userName: userInfo.userName,
                userEmail: userInfo.userEmail,
                userPhotoURL: userInfo.userPhotoURL
              });
              
              return {
                id: doc.id,
                ...questionData,
                ...userInfo
              };
            }
          }
          
          return {
            id: doc.id,
            ...questionData
          };
        })
      );
      
      return questions as IKQuestion[];
    } catch (error) {
      console.error('Error getting all questions:', error);
      throw error;
    }
  }

  // Admin: Uzmana soru atama
  async assignQuestionToExpert(questionId: string, expertId: string) {
    try {
      const questionRef = doc(this.questionsRef, questionId);
      await updateDoc(questionRef, {
        assignedExpertId: expertId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error assigning question:', error);
      throw error;
    }
  }
}

export const ikHelpService = new IKHelpService(); 