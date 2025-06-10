import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation(); // Add i18n translation hook

  return (
    <div className="neo-page">
      {/* Header */}
      <div className="neo-text-center neo-mb-8">
        <h1 className="neo-text-4xl neo-font-black neo-mb-4">{t('about.title')}</h1>
        <p className="neo-text-lg neo-font-bold">{t('about.subtitle')}</p>
      </div>
      
      <div className="neo-container-centered neo-max-w-4xl">
        <div className="neo-card neo-p-8 bg-neo-surface">
          {/* Our Mission */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Our Mission</h2>
            <p className="neo-font-bold neo-mb-4">
              {t('about.description')}
            </p>
          </div>

          {/* What We Do */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">What We Do</h2>
            <p className="neo-font-bold neo-mb-4">
              Our real-time classroom interaction platform transforms passive learning environments into engaging, interactive experiences. Teachers can instantly connect with their students through live polling, interactive questions, and real-time feedback—creating classrooms where every student participates and every voice is heard.
            </p>
          </div>

          {/* Key Features */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">{t('about.features')}</h2>
            <div className="neo-mb-4">
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="neo-font-bold neo-mb-2">• <strong>Instant Engagement:</strong> {t('about.realTimePolling')}</li>
                <li className="neo-font-bold neo-mb-2">• <strong>Anonymous Participation:</strong> Students can share thoughts and answers without fear of judgment</li>
                <li className="neo-font-bold neo-mb-2">• <strong>Simple Access:</strong> No accounts needed for students—just click a link and join</li>
                <li className="neo-font-bold neo-mb-2">• <strong>Live Results:</strong> Teachers see responses as they happen, adapting lessons in real-time</li>
                <li className="neo-font-bold neo-mb-2">• <strong>Universal Design:</strong> {t('about.easyToUse')}</li>
              </ul>
            </div>
          </div>

          {/* Our Story */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Our Story</h2>
            <p className="neo-font-bold neo-mb-4">
              Born from the understanding that meaningful learning happens through interaction, Classroom Interactive was created to solve a fundamental challenge in education: how to ensure every student has a voice in the classroom.
            </p>
            <p className="neo-font-bold neo-mb-4">
              We've designed our platform with a neo-brutalist aesthetic that's bold, accessible, and unapologetically functional—because great tools should work beautifully without getting in the way of learning.
            </p>
          </div>

          {/* Meet Our Team */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Meet Our Team</h2>
            
            <div className="neo-card neo-p-6 bg-neo-accent2 neo-mb-4">
              <h3 className="neo-text-xl neo-font-black neo-mb-2">Arch Soong - Founder & CEO</h3>
              <p className="neo-font-bold neo-mb-4">
                As a PhD student deeply immersed in the world of academia, Arch understands firsthand the challenges educators face in creating engaging, interactive learning environments. Driven by a passion for empowering lifelong learning, Arch founded Classroom Interactive with the vision of making every classroom more inclusive and dynamic.
              </p>
              <p className="neo-font-bold" style={{ fontStyle: 'italic' }}>
                "Education shouldn't be a one-way street. Every student has valuable insights to share, and every teacher deserves tools that help unlock that potential."
              </p>
            </div>

            <div className="neo-card neo-p-6 bg-neo-accent2 neo-mb-4">
              <h3 className="neo-text-xl neo-font-black neo-mb-2">Eric Tan - Founder & CTO</h3>
              <p className="neo-font-bold">
                Eric brings years of software development expertise to Classroom Interactive, specializing in building customized web solutions that solve real-world problems. With a focus on clean, efficient code, Eric ensures our platform is both powerful and intuitive.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Our Values</h2>
            <div className="neo-mb-4">
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="neo-font-bold neo-mb-4">
                  <strong>• Simplicity First:</strong> We believe powerful tools should be simple to use. No complicated setups, no steep learning curves—just open and start engaging.
                </li>
                <li className="neo-font-bold neo-mb-4">
                  <strong>• Inclusive Design:</strong> Every student deserves to participate. Our anonymous response system ensures quiet voices are heard alongside the bold ones.
                </li>
                <li className="neo-font-bold neo-mb-4">
                  <strong>• Real-Time Impact:</strong> Learning happens in the moment. Our platform delivers instant feedback and results that teachers can act on immediately.
                </li>
                <li className="neo-font-bold neo-mb-4">
                  <strong>• Accessible Innovation:</strong> Great educational technology should be available to all classrooms, regardless of budget or technical expertise.
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="neo-text-center neo-mb-8">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Join the Movement</h2>
            <p className="neo-font-bold neo-mb-4">
              Ready to transform your classroom? 
              </p>
              <p className="neo-font-bold neo-mb-4">
                Whether you're teaching a small seminar or a large lecture hall, Classroom Interactive adapts to your needs and amplifies student engagement.
              </p>
            <button
             onClick={() => window.location.href = '/'}
            className="neo-btn neo-btn-primary neo-w-full"
            style={{ backgroundColor: '#FF1493', color: 'white' }}
          >
            Experience the FUTURE NOW!
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 