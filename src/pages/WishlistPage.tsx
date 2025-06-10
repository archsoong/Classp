import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Wish {
  id: string;
  title: string;
  description: string;
  category: 'questions' | 'ui_ux' | 'analytics' | 'integration' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  voteCount: number;
  commentCount: number;
  teacherId: string;
  createdAt: string;
  hasVoted?: boolean;
  isOwnWish?: boolean;
}

interface Vote {
  wishId: string;
  comment: string;
}

const WishlistPage: React.FC = () => {
  const { t } = useTranslation(); // Add i18n translation hook
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  
  // Mock user data - in real app, this would come from auth context
  const currentTeacherId = 'TEACHER123';
  const canWishThisMonth = false; // Mock - would be calculated based on monthly limit

  // Form states
  const [newWish, setNewWish] = useState({
    title: '',
    description: '',
    category: 'other' as Wish['category']
  });
  
  const [voteComment, setVoteComment] = useState('');

  // Mock wishes data
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: '1',
      title: 'Better Mobile UI',
      description: 'The mobile interface needs better touch targets and responsive design for tablets and phones. Current buttons are too small for effective use.',
      category: 'ui_ux',
      priority: 'high',
      status: 'under_review',
      voteCount: 47,
      commentCount: 12,
      teacherId: 'TEACHER456',
      createdAt: '2024-01-15',
      hasVoted: false,
      isOwnWish: false
    },
    {
      id: '2',
      title: 'Question Timer Feature',
      description: 'Allow teachers to set time limits for questions. Students see countdown timer to create urgency and keep class moving.',
      category: 'questions',
      priority: 'medium',
      status: 'planned',
      voteCount: 32,
      commentCount: 8,
      teacherId: 'TEACHER789',
      createdAt: '2024-01-12',
      hasVoted: true,
      isOwnWish: false
    },
    {
      id: '3',
      title: 'Export Analytics to PDF',
      description: 'Provide PDF export functionality for class analytics and student response data for easy sharing with administration.',
      category: 'analytics',
      priority: 'low',
      status: 'submitted',
      voteCount: 18,
      commentCount: 5,
      teacherId: currentTeacherId,
      createdAt: '2024-01-10',
      hasVoted: false,
      isOwnWish: true
    },
    {
      id: '4',
      title: 'Integration with Google Classroom',
      description: 'Seamless integration with Google Classroom to import class rosters and sync grades automatically.',
      category: 'integration',
      priority: 'high',
      status: 'submitted',
      voteCount: 25,
      commentCount: 15,
      teacherId: 'TEACHER321',
      createdAt: '2024-01-08',
      hasVoted: false,
      isOwnWish: false
    }
  ]);

  const getCategoryLabel = (category: string) => {
    const labels = {
      questions: t('wishlist.categories.questions'),
      ui_ux: t('wishlist.categories.ui_ux'),
      analytics: t('wishlist.categories.analytics'),
      integration: t('wishlist.categories.integration'),
      other: t('wishlist.categories.other')
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      questions: '#FF7A5C',    // Orange
      ui_ux: '#69D2E7',        // Light Blue  
      analytics: '#FFD700',    // Gold
      integration: '#DA70D6',  // Orchid
      other: '#40E0D0'         // Turquoise
    };
    return colors[category as keyof typeof colors] || '#69D2E7';
  };

  const getSortedWishes = () => {
    // Always sort by votes (highest first)
    return [...wishes].sort((a, b) => b.voteCount - a.voteCount);
  };

  const handleCreateWish = () => {
    if (!newWish.title.trim() || !newWish.description.trim()) {
      alert(t('validation.fillAllFields'));
      return;
    }

    const wish: Wish = {
      id: Date.now().toString(),
      title: newWish.title,
      description: newWish.description,
      category: newWish.category,
      priority: 'medium',
      status: 'submitted',
      voteCount: 0,
      commentCount: 0,
      teacherId: currentTeacherId,
      createdAt: new Date().toISOString().split('T')[0] || '',
      hasVoted: false,
      isOwnWish: true
    };

    setWishes([wish, ...wishes]);
    setNewWish({ title: '', description: '', category: 'other' });
    setShowCreateModal(false);
  };

  const handleVote = () => {
    if (!selectedWish) return;

    // Update wish vote count
    setWishes(wishes.map(wish => 
      wish.id === selectedWish.id 
        ? { ...wish, voteCount: wish.voteCount + 1, hasVoted: true, commentCount: voteComment.trim() ? wish.commentCount + 1 : wish.commentCount }
        : wish
    ));

    setVoteComment('');
    setShowVoteModal(false);
    setSelectedWish(null);
  };

  const openVoteModal = (wish: Wish) => {
    setSelectedWish(wish);
    setShowVoteModal(true);
  };

  return (
    <div className="neo-page">
      {/* Header with title on left and submit button on right */}
      <div className="neo-container-centered neo-max-w-6xl">
        <div className="neo-flex neo-justify-between neo-items-start neo-mb-8">
          <div>
            <h1 className="neo-text-4xl neo-font-black neo-mb-2">{t('wishlist.title')}</h1>
            <p className="neo-text-l neo-font-bold">{t('wishlist.subtitle')}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`neo-btn ${canWishThisMonth ? 'neo-btn-create-manage' : 'neo-btn-muted'}`}
              disabled={!canWishThisMonth}
              style={!canWishThisMonth ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {t('wishlist.submitNewWish')}
            </button>
          </div>
        </div>

        {/* Wishes List - Full Width Cards */}
        <div className="neo-flex neo-flex-col neo-gap-6">
          {getSortedWishes().map((wish: Wish) => (
            <div key={wish.id} className="neo-card neo-p-6 bg-neo-surface" style={{ position: 'relative', paddingRight: '140px' }}>
              {/* Main Content */}
              <div>
                <div className="neo-flex neo-gap-2 neo-mb-2">
                  <span 
                    className="neo-p-1 neo-font-bold"
                    style={{ 
                      backgroundColor: getCategoryColor(wish.category),
                      color: '#000000',
                      fontSize: '12px'
                    }}
                  >
                    {getCategoryLabel(wish.category)}
                  </span>
                </div>
                <h4 className="neo-text-xl neo-font-black neo-mb-3">{wish.title}</h4>
                <p className="neo-font-bold neo-mb-4" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {wish.description}
                </p>
              </div>
              
              {/* Voting Section - Positioned Absolutely */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 'calc(100% - 48px)'
                }}
              >
                {/* Vote Count at Top */}
                <div className="neo-text-center neo-mb-2">
                  <div className="neo-text-2xl neo-font-black">▲ {wish.voteCount}</div>
                </div>
                
                {/* Vote Button/Status at Bottom */}
                <div style={{ marginTop: 'auto', width: '100%' }}>
                  {wish.isOwnWish ? (
                    <div className="neo-font-bold neo-text-center" style={{ fontSize: '12px', color: '#666' }}>
                      {t('wishlist.yourWish')}
                    </div>
                  ) : wish.hasVoted ? (
                    <div className="neo-font-bold neo-text-center" style={{ fontSize: '12px', color: '#00FF00' }}>
                      {t('wishlist.voted')}
                    </div>
                  ) : (
                    <button
                      onClick={() => openVoteModal(wish)}
                      className="neo-btn neo-btn-export"
                      style={{ fontSize: '12px', padding: '8px 12px', width: '100%' }}
                    >
                      {t('wishlist.vote')}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="neo-text-center" style={{ fontSize: '12px', color: '#666' }}>
                <span className="neo-font-bold">
                  👤 {t('wishlist.teacher')} #{wish.teacherId.slice(-3)} • {wish.createdAt} • 💬 {wish.commentCount} {t('wishlist.comments')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {getSortedWishes().length === 0 && (
          <div className="neo-card neo-p-8 neo-text-center bg-neo-surface">
            <p className="neo-text-xl neo-font-bold">{t('wishlist.noWishesFound')}</p>
          </div>
        )}
      </div>

      {/* Create Wish Modal */}
      {showCreateModal && (
        <div className="neo-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="neo-card neo-p-6 bg-neo-surface neo-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="neo-text-2xl neo-font-black neo-mb-4">{t('wishlist.createWishTitle')}</h3>
            
            <div className="neo-mb-4">
              <label className="neo-font-bold neo-mb-2 neo-block">{t('wishlist.wishTitle')}</label>
              <input
                type="text"
                value={newWish.title}
                onChange={(e) => setNewWish({...newWish, title: e.target.value})}
                className="neo-input neo-w-full bg-neo-accent1"
                placeholder={t('wishlist.wishTitlePlaceholder')}
                maxLength={100}
              />
              <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                {newWish.title.length}/100
              </div>
            </div>

            <div className="neo-mb-4">
              <label className="neo-font-bold neo-mb-2 neo-block">{t('wishlist.wishDescription')}</label>
              <textarea
                value={newWish.description}
                onChange={(e) => setNewWish({...newWish, description: e.target.value})}
                className="neo-input neo-w-full bg-neo-accent1"
                placeholder={t('wishlist.wishDescriptionPlaceholder')}
                rows={4}
                maxLength={500}
              />
              <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                {newWish.description.length}/500
              </div>
            </div>

            <div className="neo-mb-4">
              <label className="neo-font-bold neo-mb-2 neo-block">{t('wishlist.category')}</label>
              <select
                value={newWish.category}
                onChange={(e) => setNewWish({...newWish, category: e.target.value as any})}
                className="neo-input neo-w-full bg-neo-accent1"
              >
                <option value="questions">{t('wishlist.categories.questions')}</option>
                <option value="ui_ux">{t('wishlist.categories.ui_ux')}</option>
                <option value="analytics">{t('wishlist.categories.analytics')}</option>
                <option value="integration">{t('wishlist.categories.integration')}</option>
                <option value="other">{t('wishlist.categories.other')}</option>
              </select>
            </div>

            <div className="neo-flex neo-gap-4">
              <button
                onClick={handleCreateWish}
                className="neo-btn neo-btn-primary neo-w-full"
              >
                {t('wishlist.submitWish')}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="neo-btn neo-btn-muted neo-w-full"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && selectedWish && (
        <div className="neo-modal-overlay" onClick={() => setShowVoteModal(false)}>
          <div className="neo-card neo-p-6 bg-neo-surface neo-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="neo-text-2xl neo-font-black neo-mb-4">{t('wishlist.castVote')}</h3>
            
            <div className="neo-mb-4">
              <h4 className="neo-text-lg neo-font-black neo-mb-2">{selectedWish.title}</h4>
              <p className="neo-font-bold" style={{ fontSize: '14px', color: '#666' }}>
                {selectedWish.description}
              </p>
            </div>

            <div className="neo-mb-4">
              <label className="neo-font-bold neo-mb-2 neo-block">{t('wishlist.addComment')}</label>
              <textarea
                value={voteComment}
                onChange={(e) => setVoteComment(e.target.value)}
                className="neo-input neo-w-full bg-neo-accent1"
                placeholder={t('wishlist.voteCommentPlaceholder')}
                rows={3}
                maxLength={200}
              />
              <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                {voteComment.length}/200
              </div>
            </div>

            <div className="neo-flex neo-gap-4">
              <button
                onClick={handleVote}
                className="neo-btn neo-btn-primary neo-w-full"
              >
                {t('wishlist.voteAndComment')}
              </button>
              <button
                onClick={() => setShowVoteModal(false)}
                className="neo-btn neo-btn-muted neo-w-full"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 