import { useState } from 'react';
import { Link } from 'react-router-dom';
import counselors from '../data/counselors';
import './Counselors.css';

const allSpecialties = [...new Set(counselors.flatMap(c => c.specialties))];

export default function Counselors() {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);

  const filtered = counselors.filter(c => {
    const matchSearch = c.name.includes(search) || c.title.includes(search) || c.specialties.some(s => s.includes(search));
    const matchSpecialty = !selectedSpecialty || c.specialties.includes(selectedSpecialty);
    const matchAvailable = !showAvailable || c.available;
    return matchSearch && matchSpecialty && matchAvailable;
  });

  return (
    <div className="counselors-page">
      <div className="counselors-header">
        <h1>专业咨询师团队</h1>
        <p>选择最适合您的心理咨询师，开启心灵成长之旅</p>
      </div>

      <div className="counselors-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索咨询师姓名、专长..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tags">
          <button
            className={`filter-tag ${!selectedSpecialty ? 'active' : ''}`}
            onClick={() => setSelectedSpecialty('')}
          >
            全部
          </button>
          {allSpecialties.map(specialty => (
            <button
              key={specialty}
              className={`filter-tag ${selectedSpecialty === specialty ? 'active' : ''}`}
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>

        <label className="available-filter">
          <input
            type="checkbox"
            checked={showAvailable}
            onChange={e => setShowAvailable(e.target.checked)}
          />
          <span>仅显示在线咨询师</span>
        </label>
      </div>

      <div className="counselors-list">
        {filtered.length > 0 ? (
          filtered.map(counselor => (
            <Link to={`/counselor/${counselor.id}`} key={counselor.id} className="counselor-list-card">
              <div className="cl-card-left">
                <div className="cl-avatar-wrap">
                  <img src={counselor.avatar} alt={counselor.name} className="cl-avatar" />
                  {counselor.available && <span className="cl-online">在线</span>}
                </div>
                <div className="cl-info">
                  <h3>{counselor.name}</h3>
                  <p className="cl-title">{counselor.title}</p>
                  <div className="cl-specialties">
                    {counselor.specialties.map(s => (
                      <span key={s} className="cl-tag">{s}</span>
                    ))}
                  </div>
                  <p className="cl-bio">{counselor.bio.substring(0, 60)}...</p>
                </div>
              </div>
              <div className="cl-card-right">
                <div className="cl-rating">⭐ {counselor.rating}</div>
                <div className="cl-reviews">{counselor.reviews}条评价</div>
                <div className="cl-experience">{counselor.experience}年经验</div>
                <div className="cl-price">¥{counselor.price}<span>/次</span></div>
                <button className="cl-book-btn">立即预约</button>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>未找到匹配的咨询师</p>
            <p className="no-results-hint">请尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}