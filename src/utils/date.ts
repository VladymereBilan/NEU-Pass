export const getNowIso = () => new Date().toISOString();

export const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const formatTime = (iso: string | null | undefined) => {
  if (!iso) return '--:--';
  const date = new Date(iso);
  return date.toLocaleTimeString();
};

export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return '---- -- --';
  const date = new Date(iso);
  return date.toLocaleDateString();
};

export const getMonthKey = (iso: string) => iso.slice(0, 7);
