import { Request, Response } from 'express';
import convertHourToMinutes from "../utils/convertHourToMinutes";

import db from '../database/connection';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassController{
  async index(request: Request, response: Response){
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;
    
    if(!filters.week_day || !filters.subject || !filters.time){
      return response.status(400).json({
        error : 'Missing filters to search classes'
      });
    }    
    const timeInMinutes = convertHourToMinutes(time);
<<<<<<< HEAD
    const classes = await db('classes')
      .whereExists(function(){
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject','=',subject)
      .join('users', 'classes.user_id','=','users.id')
      .select(['classes.*','users.*']);
=======
    // try{

      const classes = await db('classes')
        .whereExists(function(){
          this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject','=',subject)
        .join('users', 'classes.user_id','=','users.id')
        .select(['classes.*','users.*']);
>>>>>>> 794236e9889410d45dc26b1456dbd10b0d7b0541

      return response.json(classes);
    // }catch(err){
    //   return response.status(400).json({
    //     error: "Erro não esperado",
    //     message : err
    //   });
    // }
  }

  async create(request: Request,response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
    
    const transation = await db.transaction();
  
    try{
      const insertUsersIds = await transation('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
  
      const user_id = insertUsersIds[0];
  
      const insertClassesIds = await transation('classes').insert({
        subject,
        cost,
        user_id,
      });
  
      const class_id = insertClassesIds[0];
  
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
          class_id,
        };
      })
  
      await transation('class_schedule').insert(classSchedule);
  
      await transation.commit();
  
      return response.status(201).send();
    }catch(err){
      console.log(err);
      transation.rollback();
      return response.status(400).json({
        error: "Erro não esperado, nada foi gravado!",
        message : err
      });
    }
  }
}