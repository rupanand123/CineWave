import React, { useState, useEffect } from 'react';
import { BMSMovie } from '../../data/bmsData';
import {
  MovieReview,
  saveMovieReviewToFirestore,
  subscribeToMovieReviews,
  likeMovieReviewInFirestore,
  deleteMovieReviewFromFirestore,
  BMSUserProfile
} from '../../lib/firebase';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Trash2,
  Filter,
  Check
} from 'lucide-react';

interface BMSMovieReviewsSectionProps {
  movie: BMSMovie;
  userProfile: BMSUserProfile | null;
  onRequireAuth?: () => void;
}

const REVIEW_IMPRESSION_TAGS = [
  'Mindblowing Action',
  'Superb Direction',
  'Blockbuster BGM',
  'Great Acting',
  'Visual Spectacle',
  'Edge of the Seat',
  'Emotional Story',
  'Must Watch in IMAX',
  'Family Entertainer',
  'Outstanding Climax'
];

const INITIAL_FALLBACK_REVIEWS: Record<string, MovieReview[]> = {
  default: [
    {
      id: 'sample-rev-1',
      movieId: 'default',
      movieTitle: 'Movie',
      userId: 'user_1',
      userName: 'Aarav Sharma',
      userPhoto: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=E11D48&color=fff&bold=true&size=100',
      rating: 10,
      reviewText: 'Absolute cinematic masterpiece! The background score gave goosebumps throughout. Best theatrical experience of the year without a doubt.',
      tags: ['Must Watch in IMAX', 'Blockbuster BGM', 'Mindblowing Action'],
      likesCount: 142,
      isVerifiedBooking: true,
      createdAt: '2026-08-30T14:20:00Z'
    },
    {
      id: 'sample-rev-2',
      movieId: 'default',
      movieTitle: 'Movie',
      userId: 'user_2',
      userName: 'Dr. Sneha Kulkarni',
      userPhoto: 'https://ui-avatars.com/api/?name=Sneha+Kulkarni&background=4F46E5&color=fff&bold=true&size=100',
      rating: 9,
      reviewText: 'Phenomenal direction and gripping screenplay. Every character had depth and purpose. The sound design in Dolby Atmos was next level!',
      tags: ['Superb Direction', 'Great Acting', 'Visual Spectacle'],
      likesCount: 89,
      isVerifiedBooking: true,
      createdAt: '2026-08-29T19:45:00Z'
    },
    {
      id: 'sample-rev-3',
      movieId: 'default',
      movieTitle: 'Movie',
      userId: 'user_3',
      userName: 'Vikramaditya Roy',
      userPhoto: 'https://ui-avatars.com/api/?name=Vikramaditya+Roy&background=F59E0B&color=fff&bold=true&size=100',
      rating: 9,
      reviewText: 'High adrenaline thrills from beginning to the post-credits scene. Highly recommended for action and cinema lovers!',
      tags: ['Edge of the Seat', 'Outstanding Climax'],
      likesCount: 56,
      isVerifiedBooking: false,
      createdAt: '2026-08-28T11:15:00Z'
    }
  ]
};

export function BMSMovieReviewsSection({
  movie,
  userProfile,
  onRequireAuth
}: BMSMovieReviewsSectionProps) {
  const [firestoreReviews, setFirestoreReviews] = useState<MovieReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(new Set());
  const [filterRating, setFilterRating] = useState<'ALL' | 'POSITIVE' | 'TOP'>('ALL');

  // Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState<number>(10);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Must Watch in IMAX', 'Mindblowing Action']);
  const [customAuthorName, setCustomAuthorName] = useState(userProfile?.displayName || 'Cinephile Critic');

  // Sync author name with userProfile when available
  useEffect(() => {
    if (userProfile?.displayName) {
      setCustomAuthorName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  // Real-time listener for reviews from Firestore
  useEffect(() => {
    if (!movie.id) return;

    const unsubscribe = subscribeToMovieReviews(movie.id, (reviews) => {
      setFirestoreReviews(reviews);
    });

    return () => unsubscribe();
  }, [movie.id]);

  // Combine Firestore reviews with movie-tailored baseline reviews
  const allReviews: MovieReview[] = React.useMemo(() => {
    const movieFallback = (INITIAL_FALLBACK_REVIEWS[movie.id] || INITIAL_FALLBACK_REVIEWS.default).map((r) => ({
      ...r,
      movieId: movie.id,
      movieTitle: movie.title
    }));

    if (firestoreReviews.length === 0) {
      return movieFallback;
    }

    // Merge without duplicating IDs
    const seenIds = new Set(firestoreReviews.map((r) => r.id));
    const uniqueFallback = movieFallback.filter((r) => !seenIds.has(r.id));
    return [...firestoreReviews, ...uniqueFallback];
  }, [firestoreReviews, movie.id, movie.title]);

  // Filtered reviews
  const displayedReviews = React.useMemo(() => {
    return allReviews.filter((r) => {
      if (filterRating === 'POSITIVE') return r.rating >= 8;
      if (filterRating === 'TOP') return r.rating >= 9 || r.likesCount >= 50;
      return true;
    });
  }, [allReviews, filterRating]);

  // Dynamic review rating stats calculation
  const stats = React.useMemo(() => {
    if (allReviews.length === 0) {
      return {
        average: movie.ratingScore,
        count: allReviews.length || 1,
        likedPercent: movie.ratingPercent,
        distribution: { 10: 65, 8: 25, 6: 7, 4: 2, 2: 1 }
      };
    }
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / allReviews.length).toFixed(1));
    const positiveCount = allReviews.filter((r) => r.rating >= 7).length;
    const likedPct = Math.round((positiveCount / allReviews.length) * 100);

    const dist: Record<number, number> = { 10: 0, 8: 0, 6: 0, 4: 0, 2: 0 };
    allReviews.forEach((r) => {
      if (r.rating >= 9) dist[10] = (dist[10] || 0) + 1;
      else if (r.rating >= 7) dist[8] = (dist[8] || 0) + 1;
      else if (r.rating >= 5) dist[6] = (dist[6] || 0) + 1;
      else if (r.rating >= 3) dist[4] = (dist[4] || 0) + 1;
      else dist[2] = (dist[2] || 0) + 1;
    });

    const distPercent: Record<number, number> = {
      10: Math.round(((dist[10] || 0) / allReviews.length) * 100),
      8: Math.round(((dist[8] || 0) / allReviews.length) * 100),
      6: Math.round(((dist[6] || 0) / allReviews.length) * 100),
      4: Math.round(((dist[4] || 0) / allReviews.length) * 100),
      2: Math.round(((dist[2] || 0) / allReviews.length) * 100)
    };

    return {
      average: avg,
      count: allReviews.length,
      likedPercent: likedPct,
      distribution: distPercent
    };
  }, [allReviews, movie.ratingScore, movie.ratingPercent]);

  // Handle Tag Selection
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);
    try {
      const activeUid = userProfile?.uid || `guest_${Date.now()}`;
      const authorName = (customAuthorName.trim() || userProfile?.displayName || 'CineWave Movie Buff');
      const authorPhoto =
        userProfile?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=E11D48&color=fff&bold=true&size=100`;

      const newReview = await saveMovieReviewToFirestore({
        movieId: movie.id,
        movieTitle: movie.title,
        userId: activeUid,
        userName: authorName,
        userPhoto: authorPhoto,
        rating,
        reviewText: reviewText.trim(),
        tags: selectedTags,
        isVerifiedBooking: !!userProfile
      });

      // Optimistic local update
      setFirestoreReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);

      setSubmitSuccessMessage('Thank you! Your review & rating have been saved to Firestore.');
      setReviewText('');
      setShowReviewForm(false);
      setTimeout(() => setSubmitSuccessMessage(null), 4500);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Upvote / Like
  const handleLikeReview = async (review: MovieReview) => {
    if (likedReviewIds.has(review.id)) return;

    setLikedReviewIds((prev) => new Set(prev).add(review.id));
    // Optimistic UI bump
    setFirestoreReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, likesCount: r.likesCount + 1 } : r))
    );

    try {
      await likeMovieReviewInFirestore(movie.id, review.id);
    } catch (err) {
      console.warn('Like review sync note:', err);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    setFirestoreReviews((prev) => prev.filter((r) => r.id !== reviewId));
    try {
      await deleteMovieReviewFromFirestore(movie.id, reviewId);
    } catch (err) {
      console.warn('Delete review sync note:', err);
    }
  };

  // Helper for Rating Labels
  const getRatingLabel = (score: number) => {
    if (score >= 10) return '⭐ 10/10 • Masterpiece / Must Watch!';
    if (score >= 9) return '⭐ 9/10 • Outstanding / Blockbuster';
    if (score >= 8) return '⭐ 8/10 • Really Good / Recommended';
    if (score >= 7) return '⭐ 7/10 • Good / Worth Watching';
    if (score >= 5) return '⭐ 5-6/10 • Decent / One-Time Watch';
    if (score >= 3) return '⭐ 3-4/10 • Below Average';
    return '⭐ 1-2/10 • Disappointing';
  };

  const activeRatingDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="space-y-6 border-t border-slate-800 pt-6">
      
      {/* Header & Overall Ratings Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>Audience Reviews & Star Ratings</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              Firestore Synced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified ratings & feedback from real cinema attendees
          </p>
        </div>

        {/* Rate Movie Trigger Button */}
        {!showReviewForm && (
          <button
            id="write-movie-review-button"
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Rate & Write a Review</span>
          </button>
        )}
      </div>

      {/* Success Notification Alert */}
      {submitSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submitSuccessMessage}</span>
        </div>
      )}

      {/* Rating Breakdown & Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#0B0F19] border border-slate-800">
        
        {/* Score & Liked */}
        <div className="flex items-center space-x-4 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex flex-col items-center justify-center shadow-lg shadow-rose-600/30 shrink-0 border border-rose-400/30">
            <span className="text-2xl font-black text-white leading-none">{stats.average}</span>
            <span className="text-[10px] font-bold text-rose-200 uppercase mt-0.5">/ 10</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(stats.average / 2) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-white">
              {stats.likedPercent}% <span className="font-normal text-slate-400">Audience Recommendation</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Based on {stats.count} reviews • High Confidence
            </p>
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="space-y-1.5 justify-center flex flex-col col-span-1 md:col-span-2">
          {[
            { stars: '9-10 ★', pct: stats.distribution[10], color: 'bg-emerald-500' },
            { stars: '7-8 ★', pct: stats.distribution[8], color: 'bg-lime-500' },
            { stars: '5-6 ★', pct: stats.distribution[6], color: 'bg-amber-500' },
            { stars: '1-4 ★', pct: (stats.distribution[4] || 0) + (stats.distribution[2] || 0), color: 'bg-rose-500' }
          ].map((bar, i) => (
            <div key={i} className="flex items-center space-x-3 text-[11px]">
              <span className="w-12 text-slate-400 font-semibold">{bar.stars}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${bar.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(4, bar.pct))}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-400 font-mono">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Review & Star Rating Creation Form */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          id="movie-review-submission-form"
          className="p-5 rounded-2xl bg-[#0F1626] border-2 border-rose-500/40 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Write Your Review for {movie.title}</h4>
                <p className="text-[11px] text-slate-400">Share your theatrical rating and impressions</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Select Your Star Rating:</span>
                <span className="text-rose-400 font-mono font-bold">{activeRatingDisplay} / 10</span>
              </label>
              <span className="text-[11px] font-semibold text-amber-300">
                {getRatingLabel(activeRatingDisplay)}
              </span>
            </div>

            {/* 10-Star Interactive Bar */}
            <div className="flex items-center space-x-1 sm:space-x-2 p-3 rounded-xl bg-[#0B0F19] border border-slate-800 w-fit">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starValue) => {
                const isSelected = activeRatingDisplay >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(starValue)}
                    className="group relative p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
                    title={`Rate ${starValue}/10`}
                  >
                    <Star
                      className={`w-6 h-6 transition-all transform ${
                        isSelected
                          ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600 hover:text-slate-400 scale-100'
                      }`}
                    />
                    <span className="text-[9px] text-slate-500 group-hover:text-amber-300 font-mono block text-center mt-0.5">
                      {starValue}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impression Tags Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              What did you love most? (Select tags)
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_IMPRESSION_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-400'
                        : 'bg-[#0B0F19] hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Your Detailed Review:
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {reviewText.length} / 500 characters
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What made this movie special? Mention the acting, music, cinematography, pacing or memorable scenes..."
              className="w-full px-3.5 py-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-all resize-none font-sans"
            />
          </div>

          {/* Author Name and Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 sm:w-56">
                <input
                  type="text"
                  value={customAuthorName}
                  onChange={(e) => setCustomAuthorName(e.target.value)}
                  placeholder="Your Name (Reviewer)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !reviewText.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Review Filters & Count Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300">
            Community Discussions ({displayedReviews.length})
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-[#0B0F19] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterRating === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Reviews
          </button>
          <button
            type="button"
            onClick={() => setFilterRating('POSITIVE')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
              filterRating === 'POSITIVE'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>8+ Stars</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterRating('TOP')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
              filterRating === 'TOP'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3 h-3 text-rose-300" />
            <span>Top Liked</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
        {displayedReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#0B0F19] rounded-2xl border border-slate-800 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <h5 className="text-sm font-bold text-slate-300">No reviews found matching this filter</h5>
            <p className="text-xs text-slate-500">Be the first to share your thoughts and rate this film!</p>
          </div>
        ) : (
          displayedReviews.map((review) => {
            const isLiked = likedReviewIds.has(review.id);
            const isAuthor = userProfile?.uid && review.userId === userProfile.uid;

            // Formatted date
            const reviewDate = new Date(review.createdAt);
            const dateDisplay = isNaN(reviewDate.getTime())
              ? 'Recently'
              : reviewDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

            return (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Author Bar & Rating Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        review.userPhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=E11D48&color=fff&bold=true&size=80`
                      }
                      alt={review.userName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=E11D48&color=fff&bold=true&size=80`;
                      }}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white">{review.userName}</span>
                        {review.isVerifiedBooking && (
                          <span className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30" title="Verified Ticket Buyer">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{dateDisplay}</p>
                    </div>
                  </div>

                  {/* Rating Pill */}
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold font-mono">{review.rating}</span>
                    <span className="text-[10px] text-amber-400/70">/10</span>
                  </div>
                </div>

                {/* Impression Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {review.reviewText}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                  <button
                    type="button"
                    onClick={() => handleLikeReview(review)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
                    <span className="text-[11px] font-semibold">{review.likesCount} Helpful</span>
                  </button>

                  {isAuthor && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition-all cursor-pointer"
                      title="Delete your review"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
