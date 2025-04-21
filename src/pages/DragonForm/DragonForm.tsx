import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import styles from "./DragonForm.module.css";
import { apiService } from "../../services/apiService";

export function DragonForm() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [errors, setErrors] = useState({ name: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        const newErrors = {
            name: name ? "" : "O nome é obrigatório",
            type: type ? "" : "O tipo é obrigatório",
        };
        setErrors(newErrors);
        if (!newErrors.name && !newErrors.type) {
            setLoading(true);
            try {
                const newDragon = await apiService.createDragon({ name, type });
                navigate("/dragons", { state: { newDragon } });
            } catch (error: any) {
                setApiError(error.message || "Erro ao criar o dragão");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                {apiError && <div className={styles.alert}>{apiError}</div>}
                <Input
                    placeholder="Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    error={errors.name}
                />
                <Input
                    placeholder="Tipo"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    error={errors.type}
                />
                <Button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                </Button>
                <Button
                    type="button"
                    className={styles.cancelButton}
                    variant="secondary"
                    onClick={() => navigate("/dragons")}
                    disabled={loading}
                >
                    Cancelar
                </Button>
            </form>
        </div>
    );
}