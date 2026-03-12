import { useState, useMemo } from 'react'
import { X, Save, Loader2, ChevronDown } from 'lucide-react'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { CATEGORIES, STATUSES, DEPARTMENTS } from '@/utils/constants'

const defaultForm = {
    name: '',
    vendor: '',
    category: '',
    owner_department: '',
    status: 'active',
    monthly_cost: '',
    website_url: '',
    description: '',
    icon_url: '',
    active_users_count: '',
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}

const inputClass = "w-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"

function ToolsModal({ mode, tool, onClose, onSubmit, isLoading }) {
    const initialForm = useMemo(() => {
        if (mode === 'edit' && tool) {
            return {
                name: tool.name ?? '',
                vendor: tool.vendor ?? '',
                category: tool.category ?? '',
                owner_department: tool.owner_department ?? '',
                status: tool.status ?? 'active',
                monthly_cost: tool.monthly_cost ?? '',
                website_url: tool.website_url ?? '',
                description: tool.description ?? '',
                icon_url: tool.icon_url ?? '',
                active_users_count: tool.active_users_count ?? '',
            }
        }
        return defaultForm
    }, [mode, tool])

    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1)

    const set = (key, value) => {
        setForm(f => ({ ...f, [key]: value }))
        setErrors(e => ({ ...e, [key]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Le nom est requis'
        if (!form.category) e.category = 'La catégorie est requise'
        if (!form.status) e.status = 'Le statut est requis'
        if (form.monthly_cost !== '' && isNaN(Number(form.monthly_cost))) e.monthly_cost = 'Doit être un nombre'
        return e
    }

    const handleNext = () => {
        if (step === 1) {
            const e = validate()
            if (Object.keys(e).length > 0) { setErrors(e); return }
        }
        setStep(s => s + 1)
    }

    const handleSubmit = () => {
        const e = validate()
        if (Object.keys(e).length > 0) { setErrors(e); return }
        onSubmit({
            ...form,
            monthly_cost: form.monthly_cost !== '' ? Number(form.monthly_cost) : 0,
            active_users_count: form.active_users_count !== '' ? Number(form.active_users_count) : 0,
        })
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                {mode === 'add' ? 'Ajouter un outil' : 'Modifier l\'outil'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Étape {step} sur 2 — {step === 1 ? 'Informations générales' : 'Détails & configuration'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Steps indicator */}
                    <div className="flex px-6 pt-4 gap-2">
                        {[1, 2].map(s => (
                            <div
                                key={s}
                                className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-violet-500' : 'bg-gray-200 dark:bg-white/10'}`}
                            />
                        ))}
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

                        {step === 1 && (
                            <>
                                <Field label="Nom de l'outil *" error={errors.name}>
                                    <Input
                                        type="text"
                                        placeholder="ex: Slack, Figma..."
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                    />
                                </Field>

                                <Field label="Vendor / Éditeur" error={errors.vendor}>
                                    <input
                                        type="text"
                                        placeholder="ex: Slack Technologies"
                                        value={form.vendor}
                                        onChange={e => set('vendor', e.target.value)}
                                        className={inputClass}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Catégorie */}
                                    <Field label="Catégorie *" error={errors.category}>
                                        <Select
                                            value={form.category}
                                            onChange={v => set('category', v)}
                                            placeholder="— Choisir —"
                                            options={CATEGORIES.map(c => ({ value: c, label: c }))}
                                        />
                                    </Field>

                                    {/* Statut */}
                                    <Field label="Statut *" error={errors.status}>
                                        <Select
                                            value={form.status}
                                            onChange={v => set('status', v)}
                                            placeholder="— Choisir —"
                                            options={STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                                        />
                                    </Field>
                                </div>

                                {/* Département */}
                                <Field label="Département propriétaire">
                                    <Select
                                        value={form.owner_department}
                                        onChange={v => set('owner_department', v)}
                                        placeholder="— Choisir —"
                                        options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                                    />
                                </Field>

                                <Field label="Description">
                                    <Textarea
                                        placeholder="Description de l'outil..."
                                        value={form.description}
                                        onChange={e => set('description', e.target.value)}
                                        rows={6}
                                    />
                                </Field>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Coût mensuel (€)" error={errors.monthly_cost}>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={form.monthly_cost}
                                            onChange={e => set('monthly_cost', e.target.value)}
                                        />
                                    </Field>

                                    <Field label="Utilisateurs actifs">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={form.active_users_count}
                                            onChange={e => set('active_users_count', e.target.value)}
                                        />
                                    </Field>
                                </div>

                                <Field label="URL du site web">
                                    <Input
                                        type="url"
                                        placeholder="https://..."
                                        value={form.website_url}
                                        onChange={e => set('website_url', e.target.value)}
                                    />
                                </Field>

                                <Field label="URL de l'icône">
                                    <Input
                                        type="url"
                                        placeholder="https://..."
                                        value={form.icon_url}
                                        onChange={e => set('icon_url', e.target.value)}
                                    />
                                </Field>

                                {/* Preview */}
                                {(form.name || form.icon_url) && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {form.icon_url
                                                ? <img src={form.icon_url} alt={form.name} className="w-6 h-6 object-contain" onError={e => e.target.style.display = 'none'} />
                                                : <span className="text-sm font-bold text-gray-600 dark:text-white">{form.name?.[0]}</span>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{form.name || 'Nom de l\'outil'}</p>
                                            <p className="text-xs text-gray-400">{form.vendor || 'Vendor'} · {form.category || 'Catégorie'}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
                        >
                            {step === 1 ? 'Annuler' : 'Retour'}
                        </Button>

                        {step < 2
                            ? (
                                <Button variant="primary" size="md" onClick={handleNext}>
                                    Suivant →
                                </Button>
                            )
                            : (
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? <><Loader2 size={14} className="animate-spin" /> Enregistrement...</>
                                        : <><Save size={14} /> {mode === 'add' ? 'Ajouter' : 'Enregistrer'}</>
                                    }
                                </Button>
                            )
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false)
    const selected = options.find(o => o.value === value)

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#151515] text-sm text-left transition-colors focus:outline-none focus:border-violet-500"
            >
                <span className={selected ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151515] shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {placeholder && (
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false) }}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            {placeholder}
                        </button>
                    )}
                    {options.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => { onChange(option.value); setOpen(false) }}
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${value === option.value
                                ? 'bg-violet-500/10 text-violet-500 dark:text-violet-400 font-medium'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ToolsModal