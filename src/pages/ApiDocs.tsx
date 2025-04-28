import React from 'react';

interface Endpoint {
  title: string;
  description: string;
  implementation?: string;
  notes?: string[];
  access: string;
}

interface ApiSectionProps {
  title: string;
  description: string;
  endpoints: Endpoint[];
}

const ApiSection: React.FC<ApiSectionProps> = ({ title, description, endpoints }) => {
  return (
    <section className="space-y-4">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-black/30 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-medium">{endpoint.title}</h3>
            <p className="text-gray-400">{endpoint.description}</p>
            
            {endpoint.implementation && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Uygulama:</h4>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{endpoint.implementation}</code>
                </pre>
              </div>
            )}

            {endpoint.notes && endpoint.notes.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Notlar:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {endpoint.notes.map((note, noteIndex) => (
                    <li key={noteIndex} className="text-gray-400 text-sm">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">Erişim:</span>
              <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                {endpoint.access}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ApiDocs: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">API Dokümantasyonu</h1>

      {/* Blog API Bölümü */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Blog API</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">GET /posts</h3>
            <p className="text-gray-600 mb-2">Tüm blog yazılarını getirir.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">GET https://api-7fl3duvywa-uc.a.run.app/posts</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">GET /posts/:id</h3>
            <p className="text-gray-600 mb-2">Belirli bir blog yazısını getirir.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">GET https://api-7fl3duvywa-uc.a.run.app/posts/{'{id}'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">POST /posts</h3>
            <p className="text-gray-600 mb-2">Yeni bir blog yazısı oluşturur. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">POST https://api-7fl3duvywa-uc.a.run.app/posts</p>
              <p className="mt-2 text-sm text-gray-600">Body:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
{`{
  "title": "string",
  "content": "string",
  "image": "string",
  "category": "string"
}`}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">PUT /posts/:id</h3>
            <p className="text-gray-600 mb-2">Bir blog yazısını günceller. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">PUT https://api-7fl3duvywa-uc.a.run.app/posts/{'{id}'}</p>
              <p className="mt-2 text-sm text-gray-600">Body:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
{`{
  "title": "string",
  "content": "string",
  "image": "string",
  "category": "string"
}`}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">DELETE /posts/:id</h3>
            <p className="text-gray-600 mb-2">Bir blog yazısını siler. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">DELETE https://api-7fl3duvywa-uc.a.run.app/posts/{'{id}'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin API Bölümü */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Admin API</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">POST /setAdminRole</h3>
            <p className="text-gray-600 mb-2">Bir kullanıcıya admin yetkisi verir. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">POST https://setadminrole-7fl3duvywa-uc.a.run.app</p>
              <p className="mt-2 text-sm text-gray-600">Body:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
{`{
  "email": "string"
}`}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">POST /removeAdminRole</h3>
            <p className="text-gray-600 mb-2">Bir kullanıcının admin yetkisini kaldırır. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">POST https://us-central1-minik-a61c5.cloudfunctions.net/removeAdminRole</p>
              <p className="mt-2 text-sm text-gray-600">Body:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
{`{
  "email": "string"
}`}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">GET /listAdmins</h3>
            <p className="text-gray-600 mb-2">Tüm admin kullanıcıların listesini getirir. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">GET https://listadmins-7fl3duvywa-uc.a.run.app</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">POST /setUserPremium</h3>
            <p className="text-gray-600 mb-2">Bir kullanıcıya premium üyelik verir. (Admin yetkisi gerekli)</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-mono">POST https://setuserpremium-7fl3duvywa-uc.a.run.app</p>
              <p className="mt-2 text-sm text-gray-600">Body:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
{`{
  "email": "string"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Hata Çözümleri Bölümü */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Hata Çözümleri</h2>
        
        {/* CORS Hatası */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-2">CORS Hatası</h3>
          <p className="text-gray-600 mb-4">
            Eğer "Access to fetch at ... has been blocked by CORS policy" hatası alırsanız:
          </p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Firebase Functions'da CORS ayarlarını kontrol edin</li>
            <li>İstek başlıklarında 'Authorization' header'ının doğru şekilde gönderildiğinden emin olun</li>
            <li>Firebase Functions'ı yeniden deploy edin:
              <pre className="mt-1 bg-gray-100 p-2 rounded text-sm">
                cd backend/functions && firebase deploy --only functions
              </pre>
            </li>
          </ol>
        </div>

        {/* Yetki Yönetimi Hataları */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Yetki Yönetimi Hataları</h3>
          <p className="text-gray-600 mb-4">
            Admin panelinde yetki yönetimi işlemleri çalışmıyorsa:
          </p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Kullanıcı yönetimi fonksiyonlarının tanımlı olduğundan emin olun:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>handleSetAdmin</li>
                <li>handleSetSubscriber</li>
                <li>handleRemoveAdmin</li>
              </ul>
            </li>
            <li>API endpoint'lerinin doğru olduğunu kontrol edin:
              <pre className="mt-1 bg-gray-100 p-2 rounded text-sm">
{`// Admin yap
https://setadminrole-7fl3duvywa-uc.a.run.app

// Abone yap
https://us-central1-minik-a61c5.cloudfunctions.net/setSubscriberRole

// Admin kaldır
https://removeadminrole-7fl3duvywa-uc.a.run.app`}
              </pre>
            </li>
            <li>Her işlem sonrası kullanıcı listesinin yenilenmesi için fetchAllUsers fonksiyonunun çağrıldığından emin olun</li>
            <li>Konsol hatalarını kontrol edin ve gerekirse Firebase Functions loglarını inceleyin</li>
            <li>Kullanıcının yeterli yetkiye sahip olduğundan emin olun:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Süper Admin: Tüm yetkilere sahip</li>
                <li>Admin: Kullanıcılara abone rolü verebilir</li>
                <li>Abone: Özel içeriklere erişebilir</li>
                <li>Kullanıcı: Temel erişim</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      {/* CORS ve API Endpoint Kullanımı */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#1F2A44]">CORS ve API Endpoint Kullanımı</h3>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4">
          <p className="text-[#1F2A44]/80">
            API endpoint'lerini kullanırken, Cloud Run URL'ini kullanmanız gerekmektedir. Firebase Functions URL'i yerine aşağıdaki base URL'i kullanın:
          </p>
          
          <div className="bg-[#1F2A44] text-white p-4 rounded-lg font-mono text-sm">
            https://blog-7fl3duvywa-uc.a.run.app
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-[#1F2A44]">Örnek Kullanım:</p>
            <pre className="bg-[#1F2A44] text-white p-4 rounded-lg overflow-x-auto">
              {`const response = await fetch('https://blog-7fl3duvywa-uc.a.run.app/posts/:id', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});`}
            </pre>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-[#1F2A44]">❌ Yanlış Kullanım:</p>
            <pre className="bg-red-100 text-red-800 p-4 rounded-lg overflow-x-auto">
              {`https://us-central1-minik-a61c5.cloudfunctions.net/api/posts/:id`}
            </pre>
            
            <p className="font-semibold text-[#1F2A44] mt-4">✅ Doğru Kullanım:</p>
            <pre className="bg-green-100 text-green-800 p-4 rounded-lg overflow-x-auto">
              {`https://blog-7fl3duvywa-uc.a.run.app/posts/:id`}
            </pre>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800">
              <span className="font-bold">Not:</span> API yanıtları şu formatta gelecektir:
            </p>
            <pre className="bg-yellow-100/50 p-2 rounded mt-2 text-sm">
              {`{
  "post": { /* Blog post detayları */ },
  "relatedPosts": [ /* İlgili blog yazıları */ ]
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Routing Çözümleri */}
      <ApiSection
        title="Routing & Layout Çözümleri"
        description="Rotalama ve sayfa düzeni ile ilgili çözümler"
        endpoints={[
          {
            title: "Panel Sayfalarında Navbar Gizleme",
            description: "Admin Panel ve Premium Panel gibi özel sayfalarda navbar'ın görünmemesi için uygulanan çözüm.",
            implementation: `// App.tsx
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isPanel = location.pathname === '/premium' || location.pathname === '/admin';

  return (
    <>
      {!isPanel && <Navbar />}
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/premium" element={<PremiumPanel />} />
        {/* ... diğer rotalar ... */}
      </Routes>
    </>
  );
}`,
            notes: [
              "useLocation hook'u ile mevcut sayfa yolu kontrol edilir",
              "/premium ve /admin rotalarında navbar otomatik olarak gizlenir",
              "Diğer tüm sayfalarda navbar normal şekilde görünür",
              "Panel sayfaları kendi bağımsız tasarımlarını kullanabilir"
            ],
            access: "Geliştirici"
          }
        ]}
      />
    </div>
  );
};

export default ApiDocs;