import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { apiService } from '../../services/apiService';
import { CardDragon } from '../../components/CardDragon/CardDragon';
import { Button } from '../../components/Button/Button';
import { formatDragon } from "../../utils/FormatDragon";
import { Input } from "../../components/Input/Input";
import dragonImages from "../../utils/DragonImages";
import { Modal } from "../../components/Modal/Modal";
import styles from './DragonsList.module.css';

function useDragons(
    dragons: Dragon[],
    filter: string,
    sortOrder: 'asc' | 'desc',
    currentPage: number,
    itemsPerPage: number
) {
    const sorted = [...dragons].sort((a, b) =>
        sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );
    const filtered = sorted.filter((dragon) =>
        dragon.name.toLowerCase().includes(filter.toLowerCase())
    );
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, filtered, totalPages };
}

interface Dragon {
    id: string;
    name: string;
    type: string;
    createdAt: string;
}

export function DragonsList() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [dragons, setDragons] = useState<Dragon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [itemsPerPage, setItemsPerPage] = useState<number>(9);
    const [selectedDragon, setSelectedDragon] = useState<Dragon | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const openEditModal = (dragon: Dragon) => {
        setSelectedDragon(dragon);
        setEditName(dragon.name);
        setEditType(dragon.type);
        setEditError("");
        setEditLoading(false);
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditError("");
        setEditLoading(false);
    };

    const openDeleteModal = (dragon: Dragon) => {
        setSelectedDragon(dragon);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleting(false);
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
            await apiService.updateDragon(selectedDragon!.id, {
                name: editName,
                type: editType,
            });
            setDragons(dragons.map(d =>
                d.id === selectedDragon!.id
                    ? { ...d, name: editName, type: editType }
                    : d
            ));
            setShowEditModal(false);
            setSuccessMessage("Dragão atualizado com sucesso!");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
        } catch {
            setEditError("Erro ao atualizar dragão.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiService.deleteDragon(selectedDragon!.id);
            setDragons(dragons.filter(d => d.id !== selectedDragon!.id));
            setShowDeleteModal(false);
            setSuccessMessage("Dragão excluído com sucesso!");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
        } catch {
            setError("Erro ao excluir dragão.");
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(5);
            } else {
                setItemsPerPage(9);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchDragons = async () => {
            try {
                const data = await apiService.getDragons();
                const formatted = data.map(formatDragon);
                setDragons(formatted);
            } catch (err: any) {
                setError('Erro ao carregar dragões. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchDragons();
    }, []);

    const { paginated, filtered, totalPages } = useDragons(
        dragons,
        filter,
        sortOrder,
        currentPage,
        itemsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const toggleSortOrder = () =>
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));

    const toggleFilterModal = () => setIsFilterModalOpen((prev) => !prev);

    const handleAddDragon = () => {
        navigate("/dragons/new");
    };

    const sortLabel = sortOrder === 'asc' ? 'A-Z' : 'Z-A';

    if (loading)
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Carregando dragões...</p>
            </div>
        );

    if (error)
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
        );


    const shuffledImages = [...dragonImages].sort(() => Math.random() - 0.5);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span className={styles.welcome}>
                    Olá, {user?.name}
                </span>
                <Button
                    variant="secondary"
                    className={styles.logoutButton}
                    onClick={logout}
                >
                    Sair
                </Button>
            </header>
            <div className={styles.containerBody}>
                <div className={styles.actions}>
                    <Button onClick={toggleFilterModal} className={styles.filterButton} aria-label="Filtrar dragões">
                        Filtrar
                    </Button>
                    <Button onClick={handleAddDragon} className={styles.addButtonMobile} aria-label="Adicionar dragão">
                        Adicionar Dragão
                    </Button>
                </div>

                <aside className={styles.filters}>
                    <Button onClick={handleAddDragon} className={styles.addButtonDesktop} aria-label="Adicionar dragão">
                        Adicionar Dragão
                    </Button>
                    <h2>Filtros</h2>
                    <div className={styles.filterGroup}>
                        <label htmlFor="nameFilter">Filtrar por Nome:</label>
                        <input
                            id="nameFilter"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Buscar"
                            className={styles.filterInput}
                            aria-label="Filtrar por nome"
                        />
                    </div>
                    <Button onClick={toggleSortOrder} className={styles.sortButton} aria-label={`Ordenar ${sortLabel}`}>
                        Ordenar: {sortLabel}
                    </Button>
                </aside>

                <main className={styles.mainContent}>
                    <div className={styles.grid}>
                        {paginated.length === 0 ? (
                            <div className={styles.notFound}>
                                <p>Nenhum dragão encontrado.</p>
                                <Button onClick={handleAddDragon} className={styles.addButtonDesktop} aria-label="Adicionar dragão">
                                    Adicionar Dragão
                                </Button>
                            </div>
                        ) : (
                            paginated.map((dragon, idx) => (
                                <CardDragon
                                    key={dragon.id}
                                    id={dragon.id}
                                    name={dragon.name}
                                    type={dragon.type}
                                    creationDate={new Date(dragon.createdAt).toLocaleDateString()}
                                    image={shuffledImages[idx % shuffledImages.length]}
                                    onEdit={() => openEditModal(dragon)}
                                    onDelete={() => openDeleteModal(dragon)}
                                />
                            ))
                        )}
                    </div>

                    {filtered.length > itemsPerPage && (
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                    key={index}
                                    className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                    aria-label={`Página ${index + 1}`}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                    )}

                    <Modal open={showEditModal && !!selectedDragon} onClose={closeEditModal}>
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

                    <Modal open={showDeleteModal && !!selectedDragon} onClose={closeDeleteModal}>
                        <p>Tem certeza que deseja excluir o dragão {selectedDragon?.name} ?</p>
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
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Modal>

                    <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                        <p>{successMessage}</p>
                    </Modal>
                </main>

                {isFilterModalOpen && (
                    <div className={styles.modalOverlayFilter}>
                        <div className={styles.modalContent}>
                            <Button onClick={toggleFilterModal} className={styles.closeButton} aria-label="Fechar filtros">
                                X
                            </Button>
                            <h2>Filtros</h2>
                            <div className={styles.filterGroup}>
                                <label htmlFor="nameFilterMobile">Filtrar por Nome:</label>
                                <input
                                    id="nameFilterMobile"
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Digite o nome do dragão"
                                    className={styles.filterInput}
                                    aria-label="Filtrar por nome"
                                />
                            </div>
                            <Button onClick={toggleSortOrder} className={styles.sortButton} aria-label={`Ordenar ${sortLabel}`}>
                                Ordenar: {sortLabel}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}