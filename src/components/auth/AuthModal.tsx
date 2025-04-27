import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Building2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db, auth } from '@/config/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot-password' | 'verification-pending';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'verification-pending'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  const { login, signUp, googleSignIn, resetPassword, currentUser, sendVerificationEmail } = useAuth();

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Check if user is logged in but email is not verified
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified && mode !== 'verification-pending') {
      setMode('verification-pending');
    }
  }, [currentUser]);

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

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await sendVerificationEmail();
      toast.success('Doğrulama e-postası tekrar gönderildi');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Doğrulama e-postası gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (mode === 'forgot-password') {
        await resetPassword(formData.email);
        toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
        onClose();
        return;
      }

      if (mode === 'login') {
        await login(formData.email, formData.password);
        if (!auth.currentUser?.emailVerified) {
          await auth.signOut();
          toast.error('Lütfen önce e-posta adresinizi doğrulayın. Doğrulama e-postası gönderildi.');
          return;
        }
        toast.success('Başarıyla giriş yapıldı');
        onClose();
      } else if (mode === 'register') {
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
            // Update displayName
            await updateProfile(userCredential.user, {
              displayName: `${formData.firstName} ${formData.lastName}`,
            });

            // Save user data to Firestore
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
              role: 'user',
              emailVerified: false
            });

            // Sign out immediately after registration
            await auth.signOut();
            
            // Switch to login mode and show success message
            setMode('login');
            toast.success('Hesabınız oluşturuldu. Lütfen e-posta adresinizi doğrulayın ve giriş yapın.');
            
            // Clear form data
            setFormData({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              company: ''
            });
            return;
          } catch (error) {
            console.error('Profile creation error:', error);
            await auth.signOut();
            toast.error('Hesap oluşturuldu fakat profil bilgileri kaydedilemedi. Lütfen giriş yapmayı deneyin.');
            setMode('login');
            return;
          }
        }
      }
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
            {mode === 'login' ? 'Hoş Geldiniz' : 
             mode === 'register' ? 'Hesap Oluşturun' : 
             mode === 'forgot-password' ? 'Şifre Sıfırlama' :
             'E-posta Doğrulama'}
          </h2>
          <p className="text-[#1F2A44]/60">
            {mode === 'login' ? 'İKyardım hesabınıza giriş yapın' :
             mode === 'register' ? 'Hemen ücretsiz hesap oluşturun' :
             mode === 'forgot-password' ? 'E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz' :
             'Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayın'}
          </p>
        </div>

        {mode === 'verification-pending' ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-600">
                <p className="font-medium mb-1">E-posta doğrulaması gerekli</p>
                <p>Hesabınızı kullanmaya başlamadan önce e-posta adresinizi doğrulamanız gerekmektedir. Doğrulama e-postası {currentUser?.email} adresine gönderildi.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleResendVerification}
                className="w-full bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4DA3FF]/20"
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Doğrulama E-postasını Tekrar Gönder'}
              </Button>
              
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors font-medium"
              >
                E-postanızı doğruladıysanız sayfayı yenileyin
              </button>
            </div>
          </div>
        ) : (
          <>
            {mode !== 'forgot-password' && (
              <>
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
              </>
            )}

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

              {mode !== 'forgot-password' && (
                /* Password */
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
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-sm text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors"
                    disabled={loading}
                  >
                    Şifremi Unuttum
                  </button>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4DA3FF]/20"
                disabled={loading}
              >
                {loading ? 'İşleniyor...' : 
                 mode === 'login' ? 'Giriş Yap' : 
                 mode === 'register' ? 'Kayıt Ol' : 
                 'Şifre Sıfırlama Bağlantısı Gönder'}
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
              ) : mode === 'register' ? (
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
              ) : (
                <>
                  Giriş yapmak için{' '}
                  <button 
                    onClick={() => setMode('login')}
                    className="text-[#4DA3FF] hover:text-[#4DA3FF]/80 transition-colors font-medium"
                    disabled={loading}
                  >
                    buraya tıklayın
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 