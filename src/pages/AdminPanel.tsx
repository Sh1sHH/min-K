import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { toast } from 'sonner';
import {
  Users, FileText, Settings, BarChart3, Calculator, 
  FileBox, MessageSquare, CreditCard, PieChart, Brain,
  LogOut, Home, Code2, Blocks, Trash2, ChevronRight,
  HelpCircle, Search, Filter, Shield, UserPlus, UserMinus,
  Crown, User
} from 'lucide-react';
import BlogManagement from '@/components/admin/BlogManagement';
import ApiDocs from './ApiDocs';
import ComponentDemo from './ComponentDemo';
import IKHelpQuestions from './admin/IKHelpQuestions';
import { cn } from '@/lib/utils';

interface UserRole {
  email: string;
  role: 'admin' | 'süper admin' | 'editor' | 'user';
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  disabled: boolean;
  createdAt: string;
  lastSignIn: string;
  customClaims?: {
    admin?: boolean;
    superAdmin?: boolean;
    subscriber?: boolean;
    premium?: boolean;
  };
}

const AdminPanel = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [activeSection, setActiveSection] = useState('users');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'admin' | 'premium' | 'normal'>('all');
  const auth = getAuth();

  // Sol menü öğeleri
  const menuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', title: 'Kullanıcı Yönetimi', icon: <Users className="w-5 h-5" /> },
    { id: 'blog', title: 'Blog Yönetimi', icon: <FileText className="w-5 h-5" /> },
    { id: 'api', title: 'API Dokümantasyonu', icon: <Code2 className="w-5 h-5" /> },
    { id: 'components', title: 'UI Components', icon: <Blocks className="w-5 h-5" /> },
    { id: 'ikyardim', title: 'İKyardım Hattı', icon: <MessageSquare className="w-5 h-5" /> }
  ];

  // Kullanıcı ve admin kontrolü
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      toast.error('Giriş yapmanız gerekiyor');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast.error('Bu sayfaya erişim yetkiniz yok');
      return;
    }

    // Admin listesini getir
    const fetchAdmins = async () => {
      try {
        if (!currentUser) {
          throw new Error('Giriş yapmanız gerekiyor');
        }

        const token = await currentUser.getIdToken();
        const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/listAdmins', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Admin listesi alınamadı');
        }

        const data = await response.json();
        setUsers(data as UserRole[]);
      } catch (error: any) {
        console.error('Admin listesi alınamadı:', error);
        toast.error(error.message || 'Admin listesi alınamadı');
        if (error.message.includes('yetki') || error.message.includes('token')) {
          navigate('/');
        }
      }
    };

    fetchAdmins();
  }, [currentUser, isAdmin, navigate]);

  // Tüm kullanıcıları getir
  const fetchAllUsers = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/listAllUsers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (currentUser && isAdmin) {
      fetchAllUsers();
    }
  }, [currentUser, isAdmin]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      // Email kontrolü
      if (!newUserEmail) {
        toast.error('Email adresi giriniz');
        return;
      }

      // Admin yetkisi verme isteği
      const token = await currentUser.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/setAdminRole', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newUserEmail })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Admin yetkisi verilemedi');
      }

      toast.success(responseData.message || `${newUserEmail} adresine admin yetkisi verildi`);
      setNewUserEmail('');
      
      // Admin listesini güncelle
      const adminsResponse = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/listAdmins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!adminsResponse.ok) {
        const errorData = await adminsResponse.json();
        throw new Error(errorData.message || 'Admin listesi alınamadı');
      }

      const adminsData = await adminsResponse.json();
      // Tekrar eden adminleri filtrele
      const uniqueAdmins = adminsData.filter((admin: UserRole, index: number, self: UserRole[]) =>
        index === self.findIndex((t) => t.email === admin.email)
      );
      setUsers(uniqueAdmins);
      
    } catch (error: any) {
      console.error('Admin ekleme hatası:', error);
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    try {
      if (!currentUser) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      // Admin yetkisi kaldırma isteği
      const token = await currentUser.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/removeAdminRole', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Admin yetkisi kaldırılamadı');
      }

      toast.success(responseData.message || `${email} adresinin admin yetkisi kaldırıldı`);
      
      // Admin listesini güncelle
      const adminsResponse = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/listAdmins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!adminsResponse.ok) {
        const errorData = await adminsResponse.json();
        throw new Error(errorData.message || 'Admin listesi alınamadı');
      }

      const adminsData = await adminsResponse.json();
      const uniqueAdmins = adminsData.filter((admin: UserRole, index: number, self: UserRole[]) =>
        index === self.findIndex((t) => t.email === admin.email)
      );
      setUsers(uniqueAdmins);
      
    } catch (error: any) {
      console.error('Admin yetkisi kaldırma hatası:', error);
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const handleSetAdmin = async (email: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('https://setadminrole-7fl3duvywa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to set admin role');
      }

      fetchAllUsers();
      toast.success('Admin rolü başarıyla verildi');
    } catch (error) {
      console.error('Error setting admin role:', error);
      toast.error('Admin rolü verilirken bir hata oluştu');
    }
  };

  const handleSetSubscriber = async (email: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/setUserPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to set premium role');
      }

      fetchAllUsers();
      toast.success('Premium üyelik rolü başarıyla verildi');
    } catch (error) {
      console.error('Error setting premium role:', error);
      toast.error('Premium üyelik rolü verilirken bir hata oluştu');
    }
  };

  const handleRemovePremium = async (email: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/removeUserPremium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Premium üyelik kaldırılamadı');
      }

      fetchAllUsers();
      toast.success(data.message || 'Premium üyelik rolü başarıyla kaldırıldı');
    } catch (error: any) {
      console.error('Error removing premium role:', error);
      toast.error(error.message || 'Premium üyelik rolü kaldırılırken bir hata oluştu');
    }
  };

  // Filtrelenmiş kullanıcıları hesapla
  const filteredUsers = allUsers.filter(user => {
    // Önce arama terimini kontrol et
    const searchMatch = 
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;

    // Sonra aktif filtreyi kontrol et
    let filterMatch = true;
    switch (activeFilter) {
      case 'admin':
        filterMatch = !!user.customClaims?.admin;
        break;
      case 'premium':
        filterMatch = !!user.customClaims?.premium;
        break;
      case 'normal':
        filterMatch = !user.customClaims?.admin && !user.customClaims?.premium;
        break;
      default:
        filterMatch = true;
    }

    return searchMatch && filterMatch;
  });

  // Kullanıcı girişi yoksa veya admin değilse içeriği gösterme
  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex h-screen">
        {/* Sol Menü - Küçük Versiyon */}
        <div 
          className={cn(
            "bg-black/50 backdrop-blur-sm border-r border-white/5 flex flex-col transition-all duration-300",
            isExpanded ? "w-64" : "w-16"
          )}
        >
          {/* Logo ve Başlık */}
          <div className={cn(
            "p-4 flex items-center gap-2 mb-4",
            isExpanded ? "justify-between" : "justify-center"
          )}>
            {isExpanded && <h1 className="text-xl font-semibold">Admin Panel</h1>}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-1.5 rounded-lg hover:bg-white/5 transition-all",
                isExpanded ? "ml-auto" : "mx-auto"
              )}
            >
              <ChevronRight className={cn(
                "w-5 h-5 transition-transform",
                isExpanded ? "rotate-180" : "rotate-0"
              )} />
            </button>
          </div>

          {/* Ana Sayfaya Dönüş */}
          <Link 
            to="/"
            className={cn(
              "flex items-center gap-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors mb-4",
              isExpanded ? "mx-2 px-4 py-3" : "mx-auto p-3"
            )}
            title="Ana Sayfaya Dön"
          >
            <Home className="w-5 h-5" />
            {isExpanded && <span>Ana Sayfaya Dön</span>}
          </Link>

          {/* Menü Öğeleri */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex items-center transition-colors",
                  isExpanded ? "w-full px-4 py-3 justify-between" : "mx-auto p-3",
                  activeSection === item.id 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-white/5 text-gray-300'
                )}
                title={!isExpanded ? item.title : undefined}
              >
                <div className={cn(
                  "flex items-center",
                  isExpanded ? "gap-3" : "justify-center"
                )}>
                  {item.icon}
                  {isExpanded && <span>{item.title}</span>}
                </div>
              </button>
            ))}
          </nav>

          {/* Çıkış Butonu */}
          <div className={cn(
            "border-t border-white/5",
            isExpanded ? "p-4" : "p-2"
          )}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 text-red-500 hover:bg-white/5 rounded-lg transition-colors",
                isExpanded ? "w-full px-4 py-2" : "mx-auto p-2"
              )}
              title={!isExpanded ? "Çıkış Yap" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {isExpanded && <span>Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Kullanıcı Yönetimi</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors w-64"
                      />
                    </div>
                    <div className="relative group">
                      <button 
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 bg-black/30 border border-white/10 rounded-lg hover:bg-white/5 transition-colors",
                          activeFilter !== 'all' && "text-purple-400 border-purple-500/50"
                        )}
                        onClick={() => setActiveFilter(activeFilter === 'all' ? 'all' : 'all')}
                      >
                        <Filter className="w-4 h-4" />
                        <span>{activeFilter === 'all' ? 'Filtrele' : 
                          activeFilter === 'admin' ? 'Adminler' :
                          activeFilter === 'premium' ? 'Premium Üyeler' :
                          'Normal Kullanıcılar'}</span>
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl invisible group-hover:visible transition-all z-10">
                        <button
                          onClick={() => setActiveFilter('all')}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-white/5 transition-colors",
                            activeFilter === 'all' && "text-purple-400"
                          )}
                        >
                          Tümü
                        </button>
                        <button
                          onClick={() => setActiveFilter('admin')}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-white/5 transition-colors",
                            activeFilter === 'admin' && "text-purple-400"
                          )}
                        >
                          Sadece Adminler
                        </button>
                        <button
                          onClick={() => setActiveFilter('premium')}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-white/5 transition-colors",
                            activeFilter === 'premium' && "text-purple-400"
                          )}
                        >
                          Sadece Premium Üyeler
                        </button>
                        <button
                          onClick={() => setActiveFilter('normal')}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-white/5 transition-colors",
                            activeFilter === 'normal' && "text-purple-400"
                          )}
                        >
                          Normal Kullanıcılar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400">Toplam Kullanıcı</span>
                    </div>
                    <span className="text-2xl font-semibold">{allUsers.length}</span>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-400">Admin Sayısı</span>
                    </div>
                    <span className="text-2xl font-semibold">
                      {allUsers.filter(user => user.customClaims?.admin).length}
                    </span>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Premium Üyeler</span>
                    </div>
                    <span className="text-2xl font-semibold">
                      {allUsers.filter(user => user.customClaims?.premium).length}
                    </span>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Normal Kullanıcılar</span>
                    </div>
                    <span className="text-2xl font-semibold">
                      {allUsers.filter(user => !user.customClaims?.admin && !user.customClaims?.premium).length}
                    </span>
                  </div>
                </div>

                <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Kullanıcı</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Rol</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Kayıt Tarihi</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Son Giriş</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {user.photoURL ? (
                                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-purple-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{user.displayName || 'İsimsiz Kullanıcı'}</div>
                                  <div className="text-sm text-gray-400">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                {user.customClaims?.superAdmin && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 font-medium">
                                    Süper Admin
                                  </span>
                                )}
                                {user.customClaims?.admin && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 font-medium">
                                    Admin
                                  </span>
                                )}
                                {user.customClaims?.premium && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 font-medium">
                                    Premium
                                  </span>
                                )}
                                {!user.customClaims?.superAdmin && !user.customClaims?.admin && !user.customClaims?.premium && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400 font-medium">
                                    Kullanıcı
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              {new Date(user.lastSignIn).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                {!user.customClaims?.superAdmin && currentUser?.email !== user.email && (
                                  <>
                                    {!user.customClaims?.admin && (
                                      <button
                                        onClick={() => handleSetAdmin(user.email)}
                                        className="group relative flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                        title="Admin Yap"
                                      >
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm">Admin Yap</span>
                                      </button>
                                    )}
                                    {user.customClaims?.admin && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`${user.email} adresinin admin yetkisini kaldırmak istediğinize emin misiniz?`)) {
                                            handleRemoveAdmin(user.email);
                                          }
                                        }}
                                        className="group relative flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Admin Yetkisini Kaldır"
                                      >
                                        <UserMinus className="w-4 h-4" />
                                        <span className="text-sm">Admin Kaldır</span>
                                      </button>
                                    )}
                                    {!user.customClaims?.premium && (
                                      <button
                                        onClick={() => handleSetSubscriber(user.email)}
                                        className="group relative flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                                        title="Premium Yap"
                                      >
                                        <Crown className="w-4 h-4" />
                                        <span className="text-sm">Premium Yap</span>
                                      </button>
                                    )}
                                    {user.customClaims?.premium && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`${user.email} adresinin premium üyeliğini kaldırmak istediğinize emin misiniz?`)) {
                                            handleRemovePremium(user.email);
                                          }
                                        }}
                                        className="group relative flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Premium Üyeliği Kaldır"
                                      >
                                        <UserMinus className="w-4 h-4" />
                                        <span className="text-sm">Premium Kaldır</span>
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add New Admin Form */}
                  <form onSubmit={handleAddAdmin} className="mt-6 p-4 bg-black/30 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium mb-4">Yeni Admin Ekle</h3>
                    <div className="flex gap-4">
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="Email adresi"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserPlus className="w-4 h-4" />
                        {loading ? 'İşleniyor...' : 'Admin Yap'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeSection === 'blog' && (
              <div>
                <BlogManagement />
              </div>
            )}

            {activeSection === 'api' && (
              <div>
                <ApiDocs />
              </div>
            )}

            {activeSection === 'components' && (
              <div>
                <ComponentDemo />
              </div>
            )}

            {activeSection === 'ikyardim' && (
              <div>
                <IKHelpQuestions />
              </div>
            )}

            {activeSection !== 'users' && 
             activeSection !== 'blog' && 
             activeSection !== 'api' && 
             activeSection !== 'components' &&
             activeSection !== 'ikyardim' && (
              <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                <h2 className="text-xl font-semibold mb-4">{activeSection} Yakında</h2>
                <p className="text-gray-400">Bu bölüm yakında eklenecek...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 