'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Settings, Globe, Mail, Phone, MapPin, AlignLeft } from 'lucide-react'

export default function AdminConfiguracioPage() {
  const [config, setConfig] = useState<Record<string, string>>({
    contacte_email: '',
    contacte_telefon: '',
    contacte_adreca: '',
    xarxes_instagram: '',
    xarxes_tiktok: '',
    xarxes_twitter: '',
    posicionament_hero_titol: '',
    posicionament_hero_descripcio: '',
    google_apps_script_url: '',
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  async function fetchConfig() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('configuracio')
        .select('*')

      if (error) throw error

      if (data) {
        const configMap: Record<string, string> = {}
        data.forEach((row) => {
          configMap[row.clau] = row.valor
        })
        setConfig((prev) => ({ ...prev, ...configMap }))
      }
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'Error carregant la configuració.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Upsert a la taula configuracio per cada clau
      const promises = Object.entries(config).map(([clau, valor]) => {
        return supabase
          .from('configuracio')
          .upsert({ clau, valor: valor.trim() })
      })

      const results = await Promise.all(promises)
      const errorResult = results.find(r => r.error)
      if (errorResult && errorResult.error) throw errorResult.error

      setMessage({ type: 'success', text: 'Configuració guardada correctament!' })
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'Error guardant la configuració.' })
    } finally {
      setSaving(false)
    }
  }

  function handleFieldChange(clau: string, valor: string) {
    setConfig((prev) => ({ ...prev, [clau]: valor }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 text-xs">
        <Loader2 className="animate-spin mr-2" size={20} />
        <span>Carregant configuració global...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Configuració de la Web</h1>
        <p className="text-sm text-neutral-500">Administra totes les dades estàtiques de contacte, perfils socials i textos de benvinguda de la web pública.</p>
      </div>

      {message && (
        <div className={`p-4 rounded border text-xs font-bold ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. SECCIÓ CONTACTE */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider border-b border-neutral-100 pb-2">
            <Mail size={16} className="text-primary" />
            Dades de Contacte Oficials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Correu electrònic de contacte
              </label>
              <input
                type="email"
                value={config.contacte_email}
                onChange={(e) => handleFieldChange('contacte_email', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex: info@aliancacatalanacps.cat"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Telèfon de contacte
              </label>
              <input
                type="text"
                value={config.contacte_telefon}
                onChange={(e) => handleFieldChange('contacte_telefon', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex: +34 600 11 22 33"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Adreça / Localització municipal
            </label>
            <input
              type="text"
              value={config.contacte_adreca}
              onChange={(e) => handleFieldChange('contacte_adreca', e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
              placeholder="Ex: Castell d'Aro, Platja d'Aro i s'Agaró"
            />
          </div>
        </div>

        {/* 2. SECCIÓ POSICIONAMENT HERO (BENVINGUDA) */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider border-b border-neutral-100 pb-2">
            <AlignLeft size={16} className="text-primary" />
            Posicionament de la Pàgina d'Inici (Hero)
          </h3>

          <div>
            <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Títol de Benvinguda (Hero)
            </label>
            <input
              type="text"
              value={config.posicionament_hero_titol}
              onChange={(e) => handleFieldChange('posicionament_hero_titol', e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
              placeholder="Ex: Salvem Castell d'Aro, Platja d'Aro i s'Agaró"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Text de Descripció (Hero)
            </label>
            <textarea
              rows={3}
              value={config.posicionament_hero_descripcio}
              onChange={(e) => handleFieldChange('posicionament_hero_descripcio', e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none resize-none leading-relaxed"
              placeholder="Explicació curta del posicionament..."
              required
            />
          </div>
        </div>

        {/* 3. SECCIÓ XARXES SOCIALS */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider border-b border-neutral-100 pb-2">
            <Globe size={16} className="text-primary" />
            Xarxes Socials Oficials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={config.xarxes_instagram}
                onChange={(e) => handleFieldChange('xarxes_instagram', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="https://instagram.com/nomperfil"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                value={config.xarxes_tiktok}
                onChange={(e) => handleFieldChange('xarxes_tiktok', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="https://tiktok.com/@nomperfil"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                X / Twitter URL
              </label>
              <input
                type="url"
                value={config.xarxes_twitter}
                onChange={(e) => handleFieldChange('xarxes_twitter', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="https://x.com/nomperfil"
              />
            </div>
          </div>
        </div>

        {/* 4. SECCIÓ GOOGLE SHEETS */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider border-b border-neutral-100 pb-2">
            <Settings size={16} className="text-primary" />
            Sincronització amb Google Sheets (Drive)
          </h3>

          <div>
            <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={config.google_apps_script_url}
              onChange={(e) => handleFieldChange('google_apps_script_url', e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none font-mono"
              placeholder="https://script.google.com/macros/s/.../exec"
            />
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded p-4 text-[10px] space-y-2 text-neutral-500 leading-normal font-mono">
            <p className="font-bold text-neutral-700 uppercase tracking-wide">💡 Com enllaçar-ho amb el teu Full de Càlcul:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Obre el teu Google Sheet a Drive.</li>
              <li>Ves al menú superior: <b>Extensions &gt; Apps Script</b>.</li>
              <li>Esborra tot el codi de l'editor i enganxa-hi exactament el codi que et facilitem en la documentació de l'assistent.</li>
              <li>Fes clic a <b>Implementar (Deploy) &gt; Nova implementació (New deployment)</b>.</li>
              <li>Tria el tipus: <b>Aplicació web (Web app)</b>.</li>
              <li>A <i>"Qui té accés"</i> tria: <b>Tothom (Anyone)</b>.</li>
              <li>Copia la <b>URL de l'aplicació web</b> que et doni i enganxa-la en aquest formulari a dalt.</li>
            </ol>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded bg-primary text-white py-3 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Guardant configuració...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Desar configuració de la web</span>
            </>
          )}
        </button>

      </form>
    </div>
  )
}
