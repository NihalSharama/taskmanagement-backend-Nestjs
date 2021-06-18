import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.modle';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  // Get all tasks
  @Get()
  async getAllTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @Req() req,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${
        req.user.username
      }" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.taskService.getTasks(filterDto, req.user);
  }

  // Get a single task
  @Get('/:id')
  getTask(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Task> {
    const task = this.taskService.getTask(id, req.user);
    return task;
  }

  // Create a task
  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    this.logger.verbose(
      `User "${req.user} is creating a task. Data: ${JSON.stringify(
        createTaskDto,
      )}"`,
    );
    return this.taskService.createTask(createTaskDto, req.user);
  }

  // Delete a task
  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
    return this.taskService.deleteTask(id, req.user);
  }

  // update task's status
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, req.user);
  }
}
