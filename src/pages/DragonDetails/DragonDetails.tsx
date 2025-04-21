import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDragonContext } from "../../context/DragonContext";
import { apiService } from "../../services/apiService";
import { Button } from "../../components/Button/Button";
import { formatDragon } from "../../utils/FormatDragon";
import { Input } from "../../components/Input/Input";
import dragonImages from "../../utils/DragonImages";
import { Modal } from "../../components/Modal/Modal";
import styles from "./DragonDetails.module.css";

interface DragonDetailsProps {
    image?: string;
}

export function DragonDetails({ image }: DragonDetailsProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dragon, setDragon } = useDragonContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        async function fetchDragon() {
            try {
                if (!id) throw new Error("ID do dragão não foi fornecido.");
                const data = await apiService.getDragonById(id);
                setDragon(formatDragon(data));
            } catch (err: any) {
                setError("Erro ao carregar detalhes do dragão.");
            } finally {
                setLoading(false);
            }
        }
        fetchDragon();
        return () => setDragon(null);
    }, [id, setDragon]);

    useEffect(() => {
        if (dragon) {
            setEditName(dragon.name);
            setEditType(dragon.type);
        }
    }, [dragon]);

    if (loading) return <div className={styles.loading}>Carregando...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!dragon) return null;

    const dragonImage =
        image ||
        dragonImages[
        Math.abs(
            Array.from(dragon.id)
                .map((c) => c.charCodeAt(0))
                .reduce((a, b) => a + b, 0)
        ) % dragonImages.length
        ];

    const openEditModal = () => {
        setEditName(dragon.name);
        setEditType(dragon.type);
        setEditError("");
        setEditLoading(false);
        setShowEdit(true);
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setEditError("");
        setEditLoading(false);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError("");
        if (!editName.trim() || !editType.trim()) {
            setEditError("Preencha todos os campos.");
            return;
        }
        setEditLoading(true);
        try {
            await apiService.updateDragon(dragon.id, {
                name: editName,
                type: editType,
            });
            setDragon({
                ...dragon,
                name: editName,
                type: editType,
            });
            setShowEdit(false);
            setSuccessMessage("Dragão atualizado com sucesso!");
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
        } catch (err: any) {
            setEditError("Erro ao atualizar dragão.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiService.deleteDragon(dragon.id);
            setShowDeleteModal(false);
            setSuccessMessage("Dragão excluído com sucesso!");
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/dragons");
            }, 1500);
        } catch (err) {
            setError("Erro ao excluir dragão.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.imageArea}>
                    <img src={dragonImage} alt="Dragon" className={styles.dragonImage} />
                </div>
                <div className={styles.infoArea}>
                    <div className={styles.header}>
                        <span className={styles.name}>{dragon.name}</span>
                        <span className={styles.date}>
                            Data de criação: {new Date(dragon.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <span className={styles.type}>{dragon.type}</span>
                    <div className={styles.description}>
                        <span>História</span>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, nostrum modi! Sunt veniam perferendis veritatis ipsam placeat excepturi quibusdam sequi aperiam nesciunt incidunt delectus tempore, nisi unde doloremque ab ipsa!
                        </p>
                    </div>
                    <div className={styles.actionsRow}>
                        <div className={styles.leftActions}>
                            <Button
                                variant="edit"
                                type="button"
                                onClick={openEditModal}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="delete"
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Excluir
                            </Button>
                        </div>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={() => navigate("/dragons")}
                            className={styles.backButton}
                        >
                            Voltar
                        </Button>
                    </div>
                </div>
            </div>

            <Modal open={showEdit} onClose={closeEditModal}>
                <h2>Editar Dragão</h2>
                <form onSubmit={handleEdit} className={styles.editForm}>
                    <Input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        error={!editName && editError ? editError : ""}
                        className={styles.input}
                        placeholder="Nome"
                    />
                    <Input
                        type="text"
                        value={editType}
                        onChange={e => setEditType(e.target.value)}
                        error={!editType && editError ? editError : ""}
                        className={styles.input}
                        placeholder="Tipo"
                    />
                    <div className={styles.modalActions}>
                        <Button
                            variant="edit"
                            type="submit"
                            disabled={editLoading}
                        >
                            {editLoading ? "Salvando..." : "Editar"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeEditModal}
                            disabled={editLoading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <p>Tem certeza que deseja excluir este dragão?</p>
                <div className={styles.modalActions}>
                    <Button
                        variant="delete"
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Excluindo..." : "Excluir"}
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={deleting}
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <p>{successMessage}</p>
            </Modal>
        </div>
    );
}