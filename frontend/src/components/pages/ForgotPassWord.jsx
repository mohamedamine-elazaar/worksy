import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../context/utils/api'

export default function ForgotPassWord() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [status, setStatus] = useState('')
	const [error, setError] = useState('')

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setStatus('')
		if (!email.trim()) {
			setError('Please enter your email')
			return
		}
		try {
			await authApi.requestPasswordReset(email)
			setStatus('If an account exists for this email, a reset link has been sent.')
		} catch (err) {
			if (err?.status === 404) {
				setError('this acc doesn\'t exist')
			} else {
				setError(err.message || 'Something went wrong')
			}
		}
	}

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-10">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4">
				<h1 className="text-xl font-semibold">Forgot Password</h1>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t('login.emailPlaceholder')}
					className="border p-2 rounded w-full"
				/>
				{error ? <div className="text-red-600 text-sm">{error}</div> : null}
				{status ? <div className="text-emerald-600 text-sm">{status}</div> : null}
				<button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 w-full">Send reset link</button>
				<button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 text-sm underline">Back to login</button>
			</form>
		</main>
	)
}

