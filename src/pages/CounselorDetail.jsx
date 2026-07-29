import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import counselors from '../data/counselors';
import './CounselorDetail.css';

export default function CounselorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const counselor = counselors.find(c => c.id === Number(id));
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!counselor) {
    return (
      <div className="not-found">
        <h2>咨询师不存在</h2>
        <Link to="/counselors">返回咨询师列表</Link>
      </div>
    );
  }

  // 生成未来7天的日期
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedDate || !selectedSlot) return;

    await addAppointment({
      counselorId: counselor.id,
      counselorName: counselor.name,
      counselorAvatar: counselor.avatar,
      counselorTitle: counselor.title,
      date: selectedDate,
      time: selectedSlot,
      price: counselor.price
    });

    setBookingSuccess(true);
    setTimeout(() => {
      navigate('/appointments');
    }, 2000);
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* 左侧 - 咨询师信息 */}
        <div className="detail-info">
          <Link to="/counselors" className="back-link">← 返回列表</Link>

          <div className="detail-profile">
            <div className="detail-avatar-wrap">
              <img src={counselor.avatar} alt={counselor.name} className="detail-avatar" />
              {counselor.available && <span className="detail-online">在线</span>}
            </div>
            <h1>{counselor.name}</h1>
            <p className="detail-title">{counselor.title}</p>

            <div className="detail-stats">
              <div className="detail-stat">
                <span className="ds-value">⭐ {counselor.rating}</span>
                <span className="ds-label">评分</span>
              </div>
              <div className="detail-stat">
                <span className="ds-value">{counselor.reviews}</span>
                <span className="ds-label">评价</span>
              </div>
              <div className="detail-stat">
                <span className="ds-value">{counselor.experience}年</span>
                <span className="ds-label">经验</span>
              </div>
            </div>

            <div className="detail-specialties">
              <h3>擅长领域</h3>
              <div className="detail-tags">
                {counselor.specialties.map(s => (
                  <span key={s} className="detail-tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>个人简介</h3>
              <p>{counselor.bio}</p>
            </div>

            <div className="detail-section">
              <h3>教育背景</h3>
              <p>{counselor.education}</p>
            </div>

            <div className="detail-section">
              <h3>专业认证</h3>
              <ul className="cert-list">
                {counselor.certifications.map(cert => (
                  <li key={cert}>✓ {cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧 - 预约面板 */}
        <div className="detail-booking">
          <div className="booking-card">
            <div className="booking-price">
              <span className="price-amount">¥{counselor.price}</span>
              <span className="price-unit">/次</span>
            </div>

            {bookingSuccess ? (
              <div className="booking-success">
                <span className="success-icon">✅</span>
                <h3>预约成功！</h3>
                <p>正在跳转到我的预约...</p>
              </div>
            ) : (
              <>
                <h3>选择预约时间</h3>

                <div className="date-picker">
                  <label>选择日期</label>
                  <div className="date-options">
                    {dates.map(d => {
                      const dateStr = d.toISOString().split('T')[0];
                      const dayLabel = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                      const weekLabel = d.toLocaleDateString('zh-CN', { weekday: 'short' });
                      return (
                        <button
                          key={dateStr}
                          className={`date-btn ${selectedDate === dateStr ? 'selected' : ''}`}
                          onClick={() => { setSelectedDate(dateStr); setSelectedSlot(''); }}
                        >
                          <span className="date-day">{dayLabel}</span>
                          <span className="date-week">{weekLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="slot-picker">
                    <label>选择时段</label>
                    <div className="slot-options">
                      {counselor.availableSlots.length > 0 ? (
                        counselor.availableSlots.map(slot => (
                          <button
                            key={slot}
                            className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <p className="no-slots">该咨询师暂无可预约时段</p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="book-btn"
                  disabled={!selectedDate || !selectedSlot || !counselor.available}
                  onClick={handleBook}
                >
                  {!counselor.available ? '咨询师暂不可约' : !user ? '登录后预约' : '确认预约'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}