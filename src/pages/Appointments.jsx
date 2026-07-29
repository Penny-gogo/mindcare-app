import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import counselors from '../data/counselors';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const { appointments, cancelAppointment, completeAppointment } = useAppointments();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <div className="auth-prompt">
            <div className="auth-prompt-icon">🔒</div>
            <h2>请先登录</h2>
            <p>登录后即可查看和管理您的预约</p>
            <Link to="/login" className="btn-login">去登录</Link>
          </div>
        </div>
      </div>
    );
  }

  const userAppointments = appointments.filter(a => a.userId === user.id);
  const upcoming = userAppointments.filter(a => a.status === 'upcoming');
  const completed = userAppointments.filter(a => a.status === 'completed');
  const cancelled = userAppointments.filter(a => a.status === 'cancelled');

  const getCounselor = (id) => counselors.find(c => c.id === id);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[date.getDay()];
    return `${month}月${day}日 周${weekDay}`;
  };

  const handleCancel = async (id) => {
    if (window.confirm('确定要取消这个预约吗？')) {
      await cancelAppointment(id);
    }
  };

  const handleComplete = async (id) => {
    await completeAppointment(id);
  };

  return (
    <div className="appointments-page">
      <div className="appointments-container">
        <div className="appointments-header">
          <h1>我的预约</h1>
          <p>管理您的咨询预约</p>
        </div>

        <div className="appointments-stats">
          <div className="stat-card">
            <span className="stat-number">{upcoming.length}</span>
            <span className="stat-label">待进行</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-number">{completed.length}</span>
            <span className="stat-label">已完成</span>
          </div>
          <div className="stat-card cancelled">
            <span className="stat-number">{cancelled.length}</span>
            <span className="stat-label">已取消</span>
          </div>
        </div>

        {upcoming.length > 0 && (
          <div className="appointments-section">
            <h2>即将到来</h2>
            <div className="appointment-list">
              {upcoming.map(apt => {
                const counselor = getCounselor(apt.counselorId);
                return (
                  <div key={apt.id} className="appointment-card upcoming">
                    <div className="appointment-card-header">
                      <img
                        src={counselor?.avatar || ''}
                        alt={apt.counselorName}
                        className="appointment-counselor-avatar"
                      />
                      <div className="appointment-counselor-info">
                        <h3>{apt.counselorName}</h3>
                        <p>{counselor?.title || '心理咨询师'}</p>
                      </div>
                      <span className="appointment-status upcoming-status">待进行</span>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(apt.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <span>{apt.time}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span>¥{apt.price}/次</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button
                        className="btn-complete"
                        onClick={() => handleComplete(apt.id)}
                      >
                        标记完成
                      </button>
                      <button
                        className="btn-cancel-apt"
                        onClick={() => handleCancel(apt.id)}
                      >
                        取消预约
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className="appointments-section">
            <h2>已完成</h2>
            <div className="appointment-list">
              {completed.map(apt => {
                const counselor = getCounselor(apt.counselorId);
                return (
                  <div key={apt.id} className="appointment-card completed">
                    <div className="appointment-card-header">
                      <img
                        src={counselor?.avatar || ''}
                        alt={apt.counselorName}
                        className="appointment-counselor-avatar"
                      />
                      <div className="appointment-counselor-info">
                        <h3>{apt.counselorName}</h3>
                        <p>{counselor?.title || '心理咨询师'}</p>
                      </div>
                      <span className="appointment-status completed-status">已完成</span>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(apt.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <span>{apt.time}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span>¥{apt.price}/次</span>
                      </div>
                    </div>
                    {counselor && (
                      <div className="appointment-actions">
                        <button
                          className="btn-rebook"
                          onClick={() => navigate(`/counselor/${counselor.id}`)}
                        >
                          再次预约
                        </button>
                        <button
                          className="btn-chat"
                          onClick={() => navigate('/chat')}
                        >
                          在线咨询
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cancelled.length > 0 && (
          <div className="appointments-section">
            <h2>已取消</h2>
            <div className="appointment-list">
              {cancelled.map(apt => {
                const counselor = getCounselor(apt.counselorId);
                return (
                  <div key={apt.id} className="appointment-card cancelled">
                    <div className="appointment-card-header">
                      <img
                        src={counselor?.avatar || ''}
                        alt={apt.counselorName}
                        className="appointment-counselor-avatar"
                      />
                      <div className="appointment-counselor-info">
                        <h3>{apt.counselorName}</h3>
                        <p>{counselor?.title || '心理咨询师'}</p>
                      </div>
                      <span className="appointment-status cancelled-status">已取消</span>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(apt.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <span>{apt.time}</span>
                      </div>
                    </div>
                    {counselor && (
                      <div className="appointment-actions">
                        <button
                          className="btn-rebook"
                          onClick={() => navigate(`/counselor/${counselor.id}`)}
                        >
                          重新预约
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {userAppointments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>暂无预约记录</h3>
            <p>浏览咨询师列表，预约您的第一次咨询</p>
            <Link to="/counselors" className="btn-browse">浏览咨询师</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;