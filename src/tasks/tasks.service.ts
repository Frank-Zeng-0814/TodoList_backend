import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  // Using in-memory storage while MongoDB is commented out
  private tasks: Task[] = [];
  private idCounter = 1;

  constructor() // @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  {}

  async findAll(): Promise<Task[]> {
    // MongoDB implementation:
    // return this.taskModel.find().exec();

    // In-memory implementation:
    return this.tasks;
  }

  async findOne(id: string): Promise<Task> {
    // MongoDB implementation:
    // const task = await this.taskModel.findById(id).exec();
    // if (!task) {
    //   throw new NotFoundException(`Task with ID ${id} not found`);
    // }
    // return task;

    // In-memory implementation:
    const task = this.tasks.find((t) => t['_id'] === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // MongoDB implementation:
    // const newTask = new this.taskModel(createTaskDto);
    // return newTask.save();

    // In-memory implementation:
    const newTask = {
      ...createTaskDto,
      _id: this.idCounter.toString(),
      completed: createTaskDto.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.idCounter++;
    this.tasks.push(newTask as Task);
    return newTask as Task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // MongoDB implementation:
    // const existingTask = await this.taskModel.findByIdAndUpdate(
    //   id,
    //   { $set: updateTaskDto },
    //   { new: true },
    // ).exec();
    // if (!existingTask) {
    //   throw new NotFoundException(`Task with ID ${id} not found`);
    // }
    // return existingTask;

    // In-memory implementation:
    const taskIndex = this.tasks.findIndex((t) => t['_id'] === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    return this.tasks[taskIndex];
  }

  async remove(id: string): Promise<void> {
    // MongoDB implementation:
    // const result = await this.taskModel.deleteOne({ _id: id }).exec();
    // if (result.deletedCount === 0) {
    //   throw new NotFoundException(`Task with ID ${id} not found`);
    // }

    // In-memory implementation:
    const taskIndex = this.tasks.findIndex((t) => t['_id'] === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }
}
