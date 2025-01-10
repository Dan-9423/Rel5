import { useState } from 'react';
import { Eye, EyeOff, Languages } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'signup' | 'recovery';
type Language = 'pt' | 'en';

const translations = {
  pt: {
    welcome: 'Bem-vindo à nossa Plataforma',
    secure: 'Segura, Rápida e Confiável',
    welcomeBack: 'Bem-vindo de volta',
    createAccount: 'Criar uma conta',
    newToPlatform: 'Novo na plataforma?',
    alreadyHaveAccount: 'Já possui uma conta?',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'E-mail',
    password: 'Senha',
    rememberMe: 'Lembrar-me',
    forgotPassword: 'Esqueceu a senha?',
    login: 'Entrar',
    signup: 'Criar conta',
    orContinueWith: 'Ou continue com',
    passwordRecovery: 'Recuperação de Senha',
    enterEmail: 'Digite seu e-mail para receber as instruções de recuperação',
    sendInstructions: 'Enviar Instruções',
    backToLogin: 'Voltar para o Login',
    emailSuccess: 'E-mail enviado com sucesso! Verifique sua caixa de entrada.',
    changeLanguage: 'Want to change language?'
  },
  en: {
    welcome: 'Welcome to our Platform',
    secure: 'Secure, Fast and Reliable',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    newToPlatform: 'New to platform?',
    alreadyHaveAccount: 'Already have an account?',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Sign In',
    signup: 'Sign Up',
    orContinueWith: 'Or continue with',
    passwordRecovery: 'Password Recovery',
    enterEmail: 'Enter your email to receive recovery instructions',
    sendInstructions: 'Send Instructions',
    backToLogin: 'Back to Login',
    emailSuccess: 'Email sent successfully! Check your inbox.',
    changeLanguage: 'Quer trocar de idioma?'
  }
};

export default function Auth() {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [language, setLanguage] = useState<Language>('pt');

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySuccess(true);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  if (mode === 'recovery') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#111111] p-4">
        <div className="w-full max-w-md bg-[#1C1C1C] rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="w-72 mx-auto mb-12">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">
              {t.passwordRecovery}
            </h2>
            <p className="text-gray-400 mt-2">
              {t.enterEmail}
            </p>
          </div>

          {recoverySuccess ? (
            <div className="text-center">
              <div className="bg-green-500/10 text-green-500 p-4 rounded-lg mb-6">
                {t.emailSuccess}
              </div>
              <Button
                onClick={() => {
                  setMode('login');
                  setRecoverySuccess(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t.backToLogin}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recovery-email" className="text-gray-300">{t.email}</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-[#2C2C2C] border-gray-700 text-gray-100 placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {t.sendInstructions}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-black hover:bg-white"
                  onClick={() => setMode('login')}
                >
                  {t.backToLogin}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111111] p-4">
      <div className="w-full max-w-6xl bg-[#1C1C1C] rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Image */}
        <div className="w-3/5 relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent" />
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
            alt="Ondas Abstratas"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="text-3xl font-bold text-white mb-3">{t.welcome}</h2>
            <p className="text-gray-200 text-lg">{t.secure}</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/5 p-12">
          <div className="w-72 mx-auto mb-12">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">
              {mode === 'login' ? t.welcomeBack : t.createAccount}
            </h2>
            <p className="text-gray-400 mt-2">
              {mode === 'login' ? (
                <>
                  {t.newToPlatform}{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {t.createAccount}
                  </button>
                </>
              ) : (
                <>
                  {t.alreadyHaveAccount}{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {t.login}
                  </button>
                </>
              )}
            </p>
            
            {/* Language Toggle with adjusted spacing */}
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400">
              <span>{t.changeLanguage}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-gray-400 hover:text-gray-300"
              >
                <Languages className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">{t.firstName}</Label>
                  <Input 
                    id="firstName" 
                    placeholder="João" 
                    className="bg-[#2C2C2C] border-gray-700 text-gray-100 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">{t.lastName}</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Silva" 
                    className="bg-[#2C2C2C] border-gray-700 text-gray-100 placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@exemplo.com"
                className="bg-[#2C2C2C] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#2C2C2C] border-gray-700 text-gray-100 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-300"
                >
                  {t.rememberMe}
                </label>
              </div>
              {mode === 'login' && (
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 px-0"
                  onClick={() => setMode('recovery')}
                >
                  {t.forgotPassword}
                </Button>
              )}
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full",
                "bg-blue-600 hover:bg-blue-700",
                "text-white font-medium py-2 px-4 rounded-lg",
                "transition-colors duration-200"
              )}
            >
              {mode === 'login' ? t.login : t.signup}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1C1C1C] text-gray-400">
                  {t.orContinueWith}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full bg-[#2C2C2C] border-gray-700 hover:bg-[#3C3C3C] text-gray-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-[#2C2C2C] border-gray-700 hover:bg-[#3C3C3C] text-gray-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Apple
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}