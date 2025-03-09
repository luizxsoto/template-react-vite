export function changePageTitle(prefix: string): void {
  const suffix = 'Template React Vite'
  document.title = `${prefix} | ${suffix}`
}

export function downloadFile(file: Blob, fileName: string): void {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}
