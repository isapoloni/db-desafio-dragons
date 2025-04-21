import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import styles from './Login.module.css';

export function Login() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      username: !username
        ? 'O nome de usuário é obrigatório.'
        : username !== 'admin'
          ? 'Nome de usuário inválido.'
          : '',
      password: !password
        ? 'A senha é obrigatória.'
        : password !== 'password'
          ? 'Senha inválida.'
          : '',
    };

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.password) {
      login({ name: username });
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dragons');
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      {message && <div className={styles.alert}>{message}</div>}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={`${styles.inputGroup} ${errors.username ? styles.hasError : ''}`}>
          <Input
            placeholder="Usuário"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            style={{ padding: '1rem' }}
          />
        </div>
        <div className={`${styles.inputGroup} ${errors.password ? styles.hasError : ''}`}>
          <div className={styles.passwordWrapper}>
            <Input
              placeholder="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              style={{ padding: '1rem'}}
              rightElement={
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                  variant="primary"
                >
                  {showPassword ? '🙈' : '👁️'}
                </Button>
              }
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          className={styles.button}
        >
          Login
        </Button>
      </form>
    </div>
  );
}