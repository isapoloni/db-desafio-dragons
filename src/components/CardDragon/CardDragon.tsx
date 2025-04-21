import { useState, useRef, useEffect } from 'react';
import styles from './CardDragon.module.css';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router';

interface CardDragonProps {
    id: string;
    name: string;
    type: string;
    creationDate: string;
    image: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CardDragon({ id, name, type, creationDate, image, onEdit, onDelete }: CardDragonProps) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div
            className={styles.card}
            onClick={() => navigate(`/dragons/${id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className={styles.header}>
                <div className={styles.text}>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.type}>{type}</span>
                    <span className={styles.creationDate}>Criação: {creationDate}</span>
                </div>
                <div className={styles.menu} ref={menuRef} onClick={e => e.stopPropagation()}>
                    <Button
                        className={styles.menuButton}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        variant="primary"
                    >
                        ⋮
                    </Button>
                    {menuOpen && (
                        <div className={styles.menuOptions}>
                            <Button
                                className={styles.menuOption}
                                variant="secondary"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit && onEdit();
                                }}
                            >
                                Editar
                            </Button>
                            <Button
                                className={styles.menuOption}
                                variant="danger"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDelete && onDelete();
                                }}
                            >
                                Excluir
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.image}>
                <img src={image} alt="Dragon" className={styles.dragonImage} />
            </div>
            <div className={styles.footer}>
                <span className={styles.footerLabel}>Data de criação</span>
                <span className={styles.footerDate}>{creationDate}</span>
            </div>
        </div>
    );
}