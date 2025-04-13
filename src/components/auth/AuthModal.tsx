import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
    name: '',
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
        await signUp(formData.email, formData.password);
        toast.success('Hesabınız başarıyla oluşturuldu');
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-black/80 border border-white/10 rounded-2xl p-8 shadow-xl">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          {mode === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
        </h2>
        <p className="text-gray-400 mb-6">
          {mode === 'login' 
            ? 'minİK hesabınıza giriş yapın'
            : 'Hemen ücretsiz hesap oluşturun'}
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-gray-800 font-medium py-2.5 px-4 rounded-lg mb-4 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/google.svg" alt="Google logo" className="w-5 h-5 mr-3" />
          Google ile {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-400 bg-black/80">veya</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  placeholder="Şirket Adı"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Şifremi Unuttum
              </a>
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          {mode === 'login' ? (
            <>
              Hesabınız yok mu?{' '}
              <button 
                onClick={() => setMode('register')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
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
                className="text-purple-400 hover:text-purple-300 transition-colors"
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