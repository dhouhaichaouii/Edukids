import { useEffect, useRef, useState } from 'react'
import { materialsAPI } from '../../api/liveApi'

export default function AddFileModal({
  classId,
  teacherId,
  subject,
  onSave,
  onClose,
  sc,
}) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 80)
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Le titre est requis')
      return
    }

    if (!file) {
      setError('Le fichier est requis')
      return
    }

    setSaving(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('teacherId', teacherId)
      formData.append('classId', classId)
      formData.append('subject', subject)
      formData.append('title', title.trim())
      formData.append('file', file)

      const res = await materialsAPI.add(formData)

      setDone(true)
      setTimeout(() => onSave(res.data), 600)
    } catch (err) {
      setError(err.message || 'Erreur upload fichier')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <div>
            <div
              style={{
                ...ms.pill,
                color: sc.color,
                background: `${sc.color}14`,
                border: `1.5px solid ${sc.color}28`,
              }}
            >
              {sc.emoji} {sc.label}
            </div>
            <h2 style={ms.title}>Ajouter un fichier</h2>
            <p style={ms.sub}>Ce fichier sera visible pour tous les élèves de cette classe.</p>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={ms.form}>
          <div style={ms.field}>
            <label style={ms.label}>Titre <span style={{ color: '#FF6B6B' }}>*</span></label>
            <div style={{ ...ms.inputBox, borderColor: title ? sc.color : '#E2DFF2' }}>
              <span style={ms.ico}>📄</span>
              <input
                ref={ref}
                style={ms.input}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError('')
                }}
                placeholder='Ex: "Exercice fractions – Leçon 3"'
              />
            </div>
          </div>

          <div style={ms.field}>
            <label style={ms.label}>Fichier <span style={{ color: '#FF6B6B' }}>*</span></label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null
                if (selected && selected.type !== 'application/pdf') {
                  setError('Seul le format PDF est accepté.')
                  setFile(null)
                  return
                }
                setFile(selected)
                setError('')
              }}
              style={ms.fileInput}
            />
            {file && (
              <p style={{ fontSize: '0.75rem', color: '#9E99B8', marginTop: 4 }}>
                {file.name}
              </p>
            )}
          </div>

          {error && <p style={ms.error}>⚠️ {error}</p>}
          {done && <p style={ms.success}>✓ Fichier ajouté !</p>}
        </div>

        <div style={ms.actions}>
          <button style={ms.cancelBtn} onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button
            style={{
              ...ms.saveBtn,
              background: done
                ? 'linear-gradient(135deg,#4ECDC4,#44B8B0)'
                : `linear-gradient(135deg,${sc.color},${sc.color}CC)`,
            }}
            onClick={handleSave}
            disabled={saving || done}
          >
            {saving ? 'Ajout…' : done ? '✓ Ajouté !' : '+ Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

const ms = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(26,24,48,0.50)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderRadius: 24, width: '100%', maxWidth: 460, boxShadow: '0 24px 80px rgba(100,90,150,0.22)' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 24px 0', gap: 12 },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800, marginBottom: 6 },
  title: { fontFamily: "'Baloo 2',cursive", fontSize: '1.30rem', fontWeight: 800, color: '#1A1830' },
  sub: { fontFamily: "'Nunito',sans-serif", fontSize: '0.80rem', color: '#9E99B8', marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, border: '1.5px solid rgba(200,196,220,0.30)', background: 'rgba(248,247,255,0.8)', cursor: 'pointer' },
  form: { padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontFamily: "'Nunito',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#4A4666' },
  inputBox: { position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)', border: '2px solid', borderRadius: 13 },
  ico: { position: 'absolute', left: 12, fontSize: 15, pointerEvents: 'none' },
  input: { width: '100%', height: 46, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Nunito',sans-serif", fontSize: '0.91rem', fontWeight: 600, color: '#1A1830', paddingLeft: 40, paddingRight: 14 },
  fileInput: { padding: '10px 0' },
  error: { fontFamily: "'Nunito',sans-serif", fontSize: '0.79rem', fontWeight: 700, color: '#FF6B6B' },
  success: { fontFamily: "'Nunito',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#4ECDC4' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 24px 22px', borderTop: '1.5px solid rgba(200,196,220,0.15)' },
  cancelBtn: { padding: '10px 20px', borderRadius: 9999, border: '1.5px solid rgba(200,196,220,0.35)', background: 'rgba(248,247,255,0.8)', fontFamily: "'Nunito',sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#9E99B8', cursor: 'pointer' },
  saveBtn: { padding: '10px 22px', borderRadius: 9999, border: 'none', fontFamily: "'Nunito',sans-serif", fontSize: '0.84rem', fontWeight: 800, color: '#fff', cursor: 'pointer' },
}