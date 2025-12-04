import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/useAuth'

export default function Singup() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { setRole } = useAuth()

	const [accountType, setAccountType] = useState('freelancer') // freelancer | intern | company
	const [companyName, setCompanyName] = useState('')
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')

	const validate = () => {
		// All signup info is obligatory
		if (!accountType) return t('register.error.missingFields')
		if (accountType === 'company' && !companyName.trim()) return t('register.error.missingFields')
		if (!fullName.trim()) return t('register.error.missingFields')
		if (!email.trim()) return t('register.error.missingFields')
		if (!password) return t('register.error.missingFields')
		if (!confirmPassword) return t('register.error.missingFields')
		if (password.length < 6) return t('register.error.passwordLength')
		if (password !== confirmPassword) return t('register.error.passwordMismatch')
		return ''
	}

	const mapRole = (type) => (type === 'company' ? 'entreprise' : 'user')

	const onSubmit = (e) => {
		e.preventDefault()
		const v = validate()
		if (v) {
			setError(v)
			return
		}

		const role = mapRole(accountType)
		try {
			setRole(role)
		} catch {
			try { localStorage.setItem('role', role) } catch { /* ignore */ }
		}

		const account = { fullName, email, role, accountType, companyName: accountType === 'company' ? companyName : undefined }
		try {
			localStorage.setItem('account', JSON.stringify(account))
			const prefill = {
				name: fullName,
				email,
				role,
				location: "",
				bio: "",
				skills: [],
			}
			localStorage.setItem('profile', JSON.stringify(prefill))
		} catch { /* ignore */ }

		navigate('/Profile?create=1')
	}

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-10">
			<form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-lg p-6 space-y-4">
				<h1 className="text-xl font-semibold">{t('register.title')}</h1>

				<div>
					<label className="block text-sm text-gray-700 mb-1">{t('register.accountType')}</label>
					<select
						className="w-full border rounded-md px-3 py-2 bg-white"
						value={accountType}
						onChange={(e) => setAccountType(e.target.value)}
						required
					>
						<option value="">--</option>
						<option value="freelancer">{t('register.role.freelancer')}</option>
						<option value="intern">{t('register.role.intern')}</option>
						<option value="company">{t('register.role.company')}</option>
					</select>
				</div>

				{accountType === 'company' && (
					<div>
						<label className="block text-sm text-gray-700 mb-1">{t('register.companyName')}</label>
						<input className="w-full border rounded-md px-3 py-2" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
					</div>
				)}

				<div>
					<label className="block text-sm text-gray-700 mb-1">{t('register.fullName')} *</label>
					<input className="w-full border rounded-md px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
				</div>

				<div>
					<label className="block text-sm text-gray-700 mb-1">{t('register.email')} *</label>
					<input type="email" className="w-full border rounded-md px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>

				<div>
					<label className="block text-sm text-gray-700 mb-1">{t('register.password')} *</label>
					<input type="password" className="w-full border rounded-md px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('register.passwordHint')} required />
				</div>

				<div>
					<label className="block text-sm text-gray-700 mb-1">{t('register.confirmPassword')} *</label>
					<input type="password" className="w-full border rounded-md px-3 py-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
				</div>

				{error ? <div className="text-red-600 text-sm">{error}</div> : null}

				<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2">
					{t('register.submit')}
				</button>
			</form>
		</main>
	)
}

