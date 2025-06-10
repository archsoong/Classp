import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const { t } = useTranslation(); // Add i18n translation hook
  const [imageError, setImageError] = useState(false);

  return (
    <div className="neo-page">
      {/* Header */}
      <div className="neo-text-center neo-mb-8">
        <h1 className="neo-text-4xl neo-font-black neo-mb-4">{t('contact.title')}</h1>
        <p className="neo-text-xl neo-font-bold">{t('contact.subtitle')}</p>
      </div>
      
      <div className="neo-container-centered neo-max-w-4xl">
        {/* Contact Card */}
        <div className="neo-card neo-p-6 bg-neo-surface neo-text-center">
          {/* Profile Image */}
          <div className="neo-mb-8" style={{ marginTop: '2rem' }}>
            {!imageError ? (
              <img 
                src="/profile.webp" 
                alt="Assign Arch Profile" 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto',
                  display: 'block'
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback avatar with initials
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#FF1493',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  margin: '0 auto',
                  border: '3px solid #000000'
                }}
              >
                AA
              </div>
            )}
          </div>

          <h3 className="neo-text-xl neo-font-black neo-mb-2">Assign Arch</h3>
          <p className="neo-font-bold neo-mb-4">CEO, Founder of Classp</p>
          
          {/* Email */}
          <div className="neo-mb-6">
            <a 
              href="mailto:archsoong@gmail.com" 
              className="neo-font-bold neo-text-lg"
              style={{ 
                color: '#FF1493', 
                textDecoration: 'none',
                borderBottom: '2px solid #FF1493'
              }}
            >
              📧 archsoong@gmail.com
            </a>
          </div>

          {/* Social Media Links */}
          <div className="neo-mb-8" style={{ marginBottom: '2rem' }}>
            <h4 className="neo-text-lg neo-font-black neo-mb-4">Connect with me:</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a 
                href="https://x.com/AssignArch" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/x_icon.png" alt="X" style={{ width: '32px', height: '32px' }} />
              </a>
              
              <a 
                href="https://www.facebook.com/arch.soong" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/fb_icon.png" alt="Facebook" style={{ width: '32px', height: '32px' }} />
              </a>

              <a 
                href="https://www.linkedin.com/in/archsoong/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/linkedin_icon.svg" alt="LinkedIn" style={{ width: '32px', height: '32px' }} />
              </a>

              <a 
                href="https://www.threads.net/@arch.soong" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/thread_icon.png" alt="Threads" style={{ width: '32px', height: '32px' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 