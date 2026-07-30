import { createContext, useContext, useState, useEffect } from 'react';
import * as appointmentsApi from '../api/appointments';

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化加载预约数据
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentsApi.getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('加载预约数据失败:', error);
        // 回退到 localStorage
        try {
          const saved = localStorage.getItem('mindcare_appointments');
          setAppointments(saved ? JSON.parse(saved) : []);
        } catch (e) {
          console.error('解析预约数据失败:', e);
          localStorage.removeItem('mindcare_appointments');
          setAppointments([]);
        }
      }
      setLoading(false);
    };
    loadAppointments();
  }, []);

  const addAppointment = async (appointment) => {
    try {
      const newAppointment = await appointmentsApi.addAppointment(appointment);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      console.error('添加预约失败:', error);
      // localStorage 回退
      const newAppointment = {
        id: Date.now(),
        ...appointment,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };
      const updated = [...appointments, newAppointment];
      setAppointments(updated);
      localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
      return newAppointment;
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await appointmentsApi.cancelAppointment(id);
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt));
    } catch (error) {
      console.error('取消预约失败:', error);
      setAppointments(prev => {
        const updated = prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt);
        localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const completeAppointment = async (id) => {
    try {
      await appointmentsApi.completeAppointment(id);
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'completed' } : apt));
    } catch (error) {
      console.error('完成预约失败:', error);
      setAppointments(prev => {
        const updated = prev.map(apt => apt.id === id ? { ...apt, status: 'completed' } : apt);
        localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment, completeAppointment, loading }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
  return context;
};