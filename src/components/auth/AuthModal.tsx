import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db, auth } from '@/lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  const { login, signUp, googleSignIn } = useAuth();

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      toast.success('Başarıyla giriş yapıldı');
      onClose();
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Google ile giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Başarıyla giriş yapıldı');
      } else {
        // Validate required fields for registration
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          toast.error('Ad ve soyad alanları zorunludur');
          return;
        }
        if (!formData.company.trim()) {
          toast.error('Şirket adı zorunludur');
          return;
        }
        
        const userCredential = await signUp(formData.email, formData.password);
        
        if (userCredential && userCredential.user) {
          try {
            // Önce displayName güncelle
            await updateProfile(userCredential.user, {
              displayName: `${formData.firstName} ${formData.lastName}`,
            });

            // Kısa bir bekleme ekle
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Firestore'a profil bilgilerini kaydet
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, {
              firstName: formData.firstName,
              lastName: formData.lastName,
              company: formData.company,
              email: formData.email,
              displayName: `${formData.firstName} ${formData.lastName}`,
              createdAt: serverTimestamp(),
              authProvider: 'email',
              updatedAt: serverTimestamp(),
              role: 'user'
            }, { merge: true });

            toast.success('Hesabınız başarıyla oluşturuldu');
          } catch (profileError) {
            console.error('Profile update error:', profileError);
            
            // Profil bilgilerini tekrar kaydetmeyi dene
            try {
              const userDocRef = doc(db, 'users', userCredential.user.uid);
              await setDoc(userDocRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                company: formData.company,
                email: formData.email,
                displayName: `${formData.firstName} ${formData.lastName}`,
                createdAt: serverTimestamp(),
                authProvider: 'email',
                updatedAt: serverTimestamp(),
                role: 'user'
              }, { merge: true });
              
              toast.success('Hesabınız başarıyla oluşturuldu');
            } catch (retryError) {
              console.error('Retry profile update error:', retryError);
              toast.error('Hesabınız oluşturuldu fakat profil bilgileri kaydedilemedi. Lütfen daha sonra tekrar deneyin.');
            }
          }
        }
      }
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Bu email adresi zaten kullanımda');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Geçersiz email adresi');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Şifre en az 6 karakter olmalıdır');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email veya şifre hatalı');
      } else if (error.code === 'permission-denied') {
        toast.error('Hesabınız oluşturuldu fakat profil bilgileri kaydedilemedi');
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-[#1F2A44]/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1F2A44]/60 hover:text-[#1F2A44] transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1F2A44] mb-2">
            {mode === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
          </h2>
          <p className="text-[#1F2A44]/60">
            {mode === 'login' 
              ? 'İKyardım hesabınıza giriş yapın'
              : 'Hemen ücretsiz hesap oluşturun'}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-[#1F2A44]/10 text-[#1F2A44] font-medium py-3 px-4 rounded-xl mb-6 flex items-center justify-center hover:bg-[#1F2A44]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <img src="/google.svg" alt="Google logo" className="w-5 h-5 mr-3" />
          Google ile {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1F2A44]/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-[#1F2A44]/60 bg-white">veya</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              {/* Ad Soyad Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA3FF]" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Ad"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#1F2A44]/5 rounded-xl pl-10 pr-4 py-3 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:bg-white transition-all disabled:opacity-50"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Soyad"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#1F2A44]/5 rounded-xl px-4 py-3 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:bg-white transition-all disabled:opacity-50"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Şirket Adı */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA3FF]" />
                <input
                  type="text"
                  name="company"
                  placeholder="Şirket Adı"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-[#1F2A44]/5 rounded-xl pl-10 pr-4 py-3 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:bg-white transition-all disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA3FF]" />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#1F2A44]/5 rounded-xl pl-10 pr-4 py-3 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:bg-white transition-all disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA3FF]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-[#1F2A44]/5 rounded-xl pl-10 pr-12 py-3 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:bg-white transition-all disabled:opacity-50"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2A44]/40 hover:text-[#1F2A44] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <a href="#" className="text-sm text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors">
                Şifremi Unuttum
              </a>
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4DA3FF]/20"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-[#1F2A44]/60">
          {mode === 'login' ? (
            <>
              Hesabınız yok mu?{' '}
              <button 
                onClick={() => setMode('register')}
                className="text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors font-medium"
                disabled={loading}
              >
                Hemen Oluşturun
              </button>
            </>
          ) : (
            <>
              Zaten hesabınız var mı?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors font-medium"
                disabled={loading}
              >
                Giriş Yapın
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 