import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { toast } from 'sonner';
import { User, Mail, Phone, Building, MapPin, Lock, Loader2, ArrowLeft, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserProfile {
  displayName: string;
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
    displayName: '',
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
          setProfile({
            displayName: currentUser.displayName || '',
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
        displayName: profile.displayName,
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
        setProfile({
          displayName: currentUser.displayName || '',
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

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="gap-2 px-4"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                      İptal
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Kaydet
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Düzenle
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 space-y-6">
            {/* Ad Soyad */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <div className="flex gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <Input
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ad Soyad"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="E-posta adresi"
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Telefon numarası"
                />
              </div>
            </div>

            {/* Şirket */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Şirket</label>
              <div className="flex gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <Input
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Şirket adı"
                />
              </div>
            </div>

            {/* Adres */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Adres</label>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Adres"
                />
              </div>
            </div>

            {/* Şifre Değiştirme */}
            {isEditing && (
              <div className="pt-6 mt-6 border-t border-gray-200 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Şifre Değiştir</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Yeni şifre"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Şifre Tekrar</label>
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Yeni şifre tekrar"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 