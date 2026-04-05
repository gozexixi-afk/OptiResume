import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type { ResumeData } from '@/types/resume'

export async function exportToPDF(element: HTMLElement, filename = 'resume.pdf') {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  })

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const ratio = pdfWidth / canvas.width
  const scaledFullHeight = canvas.height * ratio
  const pageCanvasHeight = Math.floor(pdfHeight / ratio)
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight))

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage()

    const srcY = page * pageCanvasHeight
    const srcH = Math.min(pageCanvasHeight, canvas.height - srcY)

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = srcH
    const ctx = pageCanvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

    const pageImg = pageCanvas.toDataURL('image/png')
    const drawH = srcH * ratio
    pdf.addImage(pageImg, 'PNG', 0, 0, pdfWidth, drawH)
  }

  pdf.save(filename)
}

export function exportToHTML(element: HTMLElement, filename = 'resume.html') {
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(el => el.outerHTML)
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  ${styles}
  <style>
    body { margin: 0; display: flex; justify-content: center; background: #f5f5f5; }
    .resume-export-wrapper { background: white; max-width: 210mm; width: 100%; min-height: 297mm; padding: 20mm; box-sizing: border-box; }
  </style>
</head>
<body>
  <div class="resume-export-wrapper">
    ${element.innerHTML}
  </div>
</body>
</html>`

  downloadFile(html, filename, 'text/html')
}

export function exportToJSON(data: ResumeData, filename = 'resume.json') {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

export function importFromJSON(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data as ResumeData)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
