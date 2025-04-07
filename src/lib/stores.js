import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const toastMessage = writable(null);
export const ACCESS_TOKEN = writable(null);
export const userId = writable(null);
export const currentPath = writable(null);
export const bookmarkStore = writable([]);
export const noticeStore = writable([]);
export const reminderStore = writable([]);
export const selectedType = writable('');
export const bookmarkSnapshotStore = writable([]);
export const reminderSnapshotStore = writable([]);

// 이미 본 공지사항 목록을 위한 스토어
const createViewedNoticesStore = () => {
  // 로컬 스토리지에서 이미 본 공지사항 ID 가져오기
  const initialValue = browser ? 
    JSON.parse(localStorage.getItem('viewedNotices') || '[]') : 
    [];
  
  const { subscribe, update, set } = writable(initialValue);
  
  return {
    subscribe,
    
    // 공지사항을 이미 본 것으로 표시
    markAsViewed: (noticeId) => {
      update(viewed => {
        // 이미 있는지 확인
        if (!viewed.includes(noticeId)) {
          const updated = [...viewed, noticeId];
          
          // 로컬 스토리지에 저장
          if (browser) {
            localStorage.setItem('viewedNotices', JSON.stringify(updated));
          }
          
          return updated;
        }
        return viewed;
      });
    },
    
    // 특정 공지사항이 이미 본 것인지 확인
    isViewed: (noticeId) => {
      let result = false;
      update(viewed => {
        result = viewed.includes(noticeId);
        return viewed;
      });
      return result;
    },
    
    // 스토어 초기화 (필요한 경우)
    reset: () => {
      set([]);
      if (browser) {
        localStorage.removeItem('viewedNotices');
      }
    }
  };
};

export const viewedNotices = createViewedNoticesStore();