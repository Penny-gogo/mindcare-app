// 预约 API - 开发环境走 JSON Server，生产环境走 localStorage
import { useApi, get, post, patch } from './client';

const APTS_KEY = 'mindcare_appointments';

function getLocalAppointments() {
  return JSON.parse(localStorage.getItem(APTS_KEY) || '[]');
}
function setLocalAppointments(appointments) {
  localStorage.setItem(APTS_KEY, JSON.stringify(appointments));
}

// 获取用户预约
export async function getAppointments(userId) {
  if (useApi) {
    return get('/appointments', { userId });
  }
  return getLocalAppointments().filter(a => a.userId === userId);
}

// 获取所有预约
export async function getAllAppointments() {
  if (useApi) {
    return get('/appointments');
  }
  return getLocalAppointments();
}

// 添加预约
export async function addAppointment(appointment) {
  if (useApi) {
    return post('/appointments', {
      ...appointment,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    });
  }
  const appointments = getLocalAppointments();
  const newAppointment = {
    id: Date.now(),
    ...appointment,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  setLocalAppointments(appointments);
  return newAppointment;
}

// 取消预约
export async function cancelAppointment(id) {
  if (useApi) {
    return patch(`/appointments/${id}`, { status: 'cancelled' });
  }
  const appointments = getLocalAppointments().map(apt =>
    apt.id === id ? { ...apt, status: 'cancelled' } : apt
  );
  setLocalAppointments(appointments);
  return appointments.find(a => a.id === id);
}

// 完成预约
export async function completeAppointment(id) {
  if (useApi) {
    return patch(`/appointments/${id}`, { status: 'completed' });
  }
  const appointments = getLocalAppointments().map(apt =>
    apt.id === id ? { ...apt, status: 'completed' } : apt
  );
  setLocalAppointments(appointments);
  return appointments.find(a => a.id === id);
}