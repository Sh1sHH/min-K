import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { toast } from 'sonner';
import { User, Mail, Phone, Building, MapPin, Lock, Loader2, ArrowLeft, X, Check, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InputMask from 'react-input-mask';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const loadUserProfile = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'users', currentUser.uid);
      
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const [firstName = '', lastName = ''] = (currentUser.displayName || '').split(' ');
          setProfile({
            firstName,
            lastName,
            email: currentUser.email || '',
            phone: data.phone || '',
            company: data.company || '',
            address: data.address || '',
          });
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
        toast.error('Profil bilgileri yüklenemedi');
      }
    };

    loadUserProfile();
  }, [currentUser, navigate]);

  const handleSave = async () => {
    if (!currentUser) return;

    // Şifre kontrolü
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const db = getFirestore();
    const userRef = doc(db, 'users', currentUser.uid);

    try {
      // Firebase Auth profilini güncelle
      await updateProfile(currentUser, {
        displayName: `${profile.firstName} ${profile.lastName}`.trim(),
      });

      // Email değiştiyse güncelle
      if (profile.email !== currentUser.email) {
        await updateEmail(currentUser, profile.email);
      }

      // Şifre değiştiyse güncelle
      if (newPassword && newPassword === confirmPassword) {
        await updatePassword(currentUser, newPassword);
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Şifreniz başarıyla güncellendi');
      }

      // Firestore'daki ek bilgileri güncelle
      await updateDoc(userRef, {
        phone: profile.phone,
        company: profile.company,
        address: profile.address,
        updatedAt: new Date(),
      });

      toast.success('Profil başarıyla güncellendi');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profil güncellenirken hata:', error);
      toast.error(error.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Değişiklikleri iptal et ve orijinal değerlere geri dön
    loadUserProfile();
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const loadUserProfile = async () => {
    if (!currentUser) return;
    
    const db = getFirestore();
    const userRef = doc(db, 'users', currentUser.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const [firstName = '', lastName = ''] = (currentUser.displayName || '').split(' ');
        setProfile({
          firstName,
          lastName,
          email: currentUser.email || '',
          phone: data.phone || '',
          company: data.company || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, '');
    
    // Maksimum 11 rakam kontrolü
    if (numbers.length > 11) return;
    
    // Her zaman (0 ile başlat
    if (!value.startsWith('(0')) {
      value = '(0' + numbers;
    }
    
    setProfile(prev => ({ ...prev, phone: value }));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri Dön</span>
          </button>
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="gap-2"
                disabled={loading}
              >
                <X className="w-4 h-4" />
                İptal
              </Button>
              <Button
                onClick={handleSave}
                variant="default"
                className="gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Kaydet
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              className="gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Profili Düzenle
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Kişisel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Kişisel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ad</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ad"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Soyad</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Soyad"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-posta</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="E-posta adresi"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <InputMask
                  mask="(0999) 999 99 99"
                  maskChar="_"
                  value={profile.phone}
                  onChange={handlePhoneChange}
                  disabled={!isEditing}
                  onFocus={(e) => {
                    const input = e.target;
                    if (!input.value) {
                      input.value = '(0';
                    }
                    // Her zaman (0'dan sonraya konumla
                    setTimeout(() => {
                      input.setSelectionRange(2, 2);
                    }, 0);
                  }}
                  onClick={(e) => {
                    const input = e.target as HTMLInputElement;
                    // Her tıklamada (0'dan sonraya konumla
                    setTimeout(() => {
                      input.setSelectionRange(2, 2);
                    }, 0);
                  }}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      type="tel"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="(05XX) XXX XX XX"
                    />
                  )}
                </InputMask>
              </div>
            </CardContent>
          </Card>

          {/* İş Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                İş Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Şirket</label>
                <Input
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Şirket adı"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Adres</label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Adres"
                />
              </div>
            </CardContent>
          </Card>

          {/* Şifre Değiştirme */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Şifre Değiştir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Yeni Şifre</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Yeni şifre"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Şifre Tekrar</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Yeni şifre tekrar"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 