import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

interface Settings {
  line_id: string;
  location: string;
  facebook?: string;
  instagram?: string;
  // Hero Section
  hero_label: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  // Brand Story
  brand_story_title_1: string;
  brand_story_title_2: string;
  brand_story_desc_1: string;
  brand_story_desc_2: string;
  // Featured Products
  featured_label: string;
  featured_title: string;
  // Contact Section
  contact_title: string;
  contact_subtitle: string;
  // Hero Stats
  stat_num_1: string;
  stat_label_1: string;
  stat_num_2: string;
  stat_label_2: string;
  stat_num_3: string;
  stat_label_3: string;
  // Footer
  footer_brand_name: string;
  footer_brand_name_en: string;
  footer_brand_desc: string;
  footer_product_heading: string;
  footer_product_list: string;
  footer_contact_heading: string;
  footer_copyright: string;
  footer_slogan: string;
  [key: string]: string | undefined;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
  update: (newSettings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Settings = {
  line_id: '@miang-khanad',
  location: 'เชียงใหม่, ประเทศไทย',
  facebook: '',
  instagram: '',
  hero_label: 'ล้านนา Minimal Luxury',
  hero_title_1: 'งานฝีมือที่',
  hero_title_2: 'ทนกาลเวลา',
  hero_subtitle: 'สินค้าหัตถกรรมล้านนาคัดสรรพิเศษ ทั้งเครื่องแต่งกายผ้าทอมือ และเครื่องดนตรีพื้นเมืองฝีมือช่างชำนาญ',
  brand_story_title_1: 'เรื่องราวของ',
  brand_story_title_2: 'เมียงขนาด',
  brand_story_desc_1: '"เมียงขนาด" มาจากภาษาล้านนาโบราณ หมายถึงขุมทรัพย์ที่ซ่อนอยู่ในความเรียบง่าย เราเชื่อว่างานหัตถกรรมของช่างฝีมือภาคเหนือ คือสมบัติที่ควรได้รับการยกระดับและส่งต่อ',
  brand_story_desc_2: 'เราคัดเลือกผลิตภัณฑ์อย่างพิถีพิถัน ทั้งเสื้อผ้าทอมือจากกลุ่มแม่บ้าน และเครื่องดนตรีจากช่างผู้สืบทอดภูมิปัญญา ทุกชิ้นงานคือบทกวีเงียบๆ ที่เล่าเรื่องราวของดินแดนล้านนา',
  featured_label: 'คอลเลกชันแนะนำ',
  featured_title: 'สินค้าเด่น',
  contact_title: 'มีคำถาม? เราพร้อมตอบทุกข้อสงสัย',
  contact_subtitle: 'พร้อมให้บริการ 7 วัน',
  // Hero Stats
  stat_num_1: '10+',
  stat_label_1: 'ปีแห่งประสบการณ์',
  stat_num_2: '50+',
  stat_label_2: 'รายการสินค้า',
  stat_num_3: '100%',
  stat_label_3: 'งานฝีมือแท้',
  // Footer
  footer_brand_name: 'เมียงขนาด',
  footer_brand_name_en: 'MIANG KHANAD',
  footer_brand_desc: 'ยกระดับงานหัตถกรรมล้านนาสู่ Minimal Luxury\nด้วยคุณภาพที่ไม่ประนีประนอม',
  footer_product_heading: 'สินค้า',
  footer_product_list: 'เครื่องแต่งกาย, เครื่องดนตรีพื้นเมือง, คอลเลกชันใหม่',
  footer_contact_heading: 'ติดต่อ',
  footer_copyright: '© 2025 เมียงขนาด. สงวนลิขสิทธิ์',
  footer_slogan: 'ลำดับแห่งล้านนา — crafted with love'
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.settings.get();
      if (res.success && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = async (newSettings: Partial<Settings>) => {
    try {
      const res = await api.settings.update(newSettings);
      if (res.success && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, update }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
