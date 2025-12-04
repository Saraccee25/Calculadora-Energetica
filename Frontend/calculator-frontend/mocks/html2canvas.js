export default function html2canvas() {
  return Promise.resolve({
    toDataURL: () => "data:image/png;base64,FAKE",
    height: 1000,
    width: 1000,
  });
}
