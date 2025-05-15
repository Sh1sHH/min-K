import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Building2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db, auth } from '@/config/firebase';
import { Input } from '../ui/input';

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
    <div className="fixed inset-0 z-50">
      {/* Main Container */}
      <div className="flex w-full h-full">
        {/* Left Side - Image */}
        <div className="relative hidden lg:block w-1/2 h-full">
          <img 
            src="/login.webp" 
            alt="Login Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Sağa doğru gradient geçişi */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#010304]" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full bg-[#010304] overflow-y-auto">
          <div className="max-w-xl mx-auto p-8 lg:p-12 min-h-full flex flex-col">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center space-y-8">
              {/* Logo and Title */}
              <div className="space-y-4">
                <img src="/logo.webp" alt="Logo" className="h-16" />
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">
                    {mode === 'login' ? 'Hesabınıza giriş yapın' : 
                     mode === 'register' ? 'Yeni hesap oluşturun' : 
                     mode === 'forgot-password' ? 'Şifrenizi sıfırlayın' :
                     'E-posta Doğrulama'}
                  </h2>
                  <p className="text-gray-400">
                    {mode === 'login' ? 'Tekrar hoş geldiniz! Lütfen bilgilerinizi girin.' : 
                     mode === 'register' ? 'Hemen ücretsiz hesap oluşturun.' : 
                     mode === 'forgot-password' ? 'E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.' :
                     'Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayın.'}
                  </p>
                </div>
              </div>

              {mode === 'verification-pending' ? (
                <div className="space-y-6">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                      <p className="font-medium mb-1">E-posta doğrulaması gerekli</p>
                      <p>Hesabınızı kullanmaya başlamadan önce e-posta adresinizi doğrulamanız gerekmektedir. Doğrulama e-postası {currentUser?.email} adresine gönderildi.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={handleResendVerification}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Gönderiliyor...' : 'Doğrulama E-postasını Tekrar Gönder'}
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      E-postanızı doğruladıysanız sayfayı yenileyin
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'register' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            type="text"
                            name="firstName"
                            placeholder="Ad"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="bg-[#010304]/80 border-[#2A2F3E] text-white placeholder:text-gray-400"
                            icon={<User className="w-5 h-5 text-gray-400" />}
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="text"
                            name="lastName"
                            placeholder="Soyad"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="bg-[#010304]/80 border-[#2A2F3E] text-white placeholder:text-gray-400"
                            icon={<User className="w-5 h-5 text-gray-400" />}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Input
                        type="email"
                        name="email"
                        placeholder="E-posta"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-[#010304]/80 border-[#2A2F3E] text-white placeholder:text-gray-400"
                        icon={<Mail className="w-5 h-5 text-gray-400" />}
                        disabled={loading}
                      />
                    </div>

                    {mode !== 'forgot-password' && (
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Şifre"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-[#010304]/80 border-[#2A2F3E] text-white placeholder:text-gray-400"
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? 
                              <EyeOff className="w-5 h-5" /> : 
                              <Eye className="w-5 h-5" />
                            }
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'register' && (
                      <div className="space-y-2">
                        <Input
                          type="text"
                          name="company"
                          placeholder="Şirket Adı"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="bg-[#010304]/80 border-[#2A2F3E] text-white placeholder:text-gray-400"
                          icon={<Building2 className="w-5 h-5 text-gray-400" />}
                          disabled={loading}
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'İşleniyor...' : 
                       mode === 'login' ? 'Giriş Yap' : 
                       mode === 'register' ? 'Kayıt Ol' : 
                       'Şifremi Sıfırla'}
                    </Button>
                  </form>

                  {mode !== 'forgot-password' && (
                    <>
                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-[#010304] text-gray-400">veya</span>
                        </div>
                      </div>

                      {/* Social Buttons */}
                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-[#010304]/80 border-[#2A2F3E] text-white hover:bg-[#2A2F3E]"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                        >
                          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                          Google ile devam et
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Footer Links */}
                  <div className="text-center text-sm">
                    {mode === 'login' ? (
                      <>
                        <p className="text-gray-400">
                          Hesabınız yok mu?{' '}
                          <button
                            type="button"
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => setMode('register')}
                            disabled={loading}
                          >
                            Hemen kaydolun
                          </button>
                        </p>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-300 mt-2"
                          onClick={() => setMode('forgot-password')}
                          disabled={loading}
                        >
                          Şifrenizi mi unuttunuz?
                        </button>
                      </>
                    ) : mode === 'register' ? (
                      <p className="text-gray-400">
                        Zaten hesabınız var mı?{' '}
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-400"
                          onClick={() => setMode('login')}
                          disabled={loading}
                        >
                          Giriş yapın
                        </button>
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-400"
                        onClick={() => setMode('login')}
                        disabled={loading}
                      >
                        Giriş sayfasına dön
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 