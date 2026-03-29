import { Router } from 'express';
import { ChamadoController } from '../controllers/chamado.controller';
import { TarefaController } from '../controllers/tarefa.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const chamadoController = new ChamadoController();
const tarefaController = new TarefaController();

router.use(authenticate);

router.get('/dashboard', (req, res, next) => chamadoController.getDashboard(req, res, next));
router.get('/', (req, res, next) => chamadoController.findAll(req, res, next));
router.get('/:id', (req, res, next) => chamadoController.findById(req, res, next));
router.post('/', (req, res, next) => chamadoController.create(req, res, next));
router.put('/:id', (req, res, next) => chamadoController.update(req, res, next));
router.patch('/:id/finalizar', (req, res, next) => chamadoController.finalizar(req, res, next));
router.delete('/:id', (req, res, next) => chamadoController.delete(req, res, next));

// Tarefas nested under chamados
router.get('/:chamadoId/tarefas', (req, res, next) => tarefaController.findByChamado(req, res, next));
router.post('/:chamadoId/tarefas', (req, res, next) => tarefaController.create(req, res, next));
router.patch('/tarefas/:id/fechar', (req, res, next) => tarefaController.fechar(req, res, next));
router.delete('/tarefas/:id', (req, res, next) => tarefaController.delete(req, res, next));

export default router;
