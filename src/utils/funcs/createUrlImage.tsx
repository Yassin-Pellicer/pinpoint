const fileURL = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (url: string | undefined) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === 'string') {
      console.log(result);
      callback(result);
    }
  };
  reader.readAsDataURL(file);
};

export default fileURL;
