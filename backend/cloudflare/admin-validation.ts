import { z } from 'zod';
import { HttpError } from './http';

const text = z.string().trim().min(1).max(20000);
const optionalText = z.string().max(20000).nullable().optional();
const id = z.number().int().positive().max(2147483647);
const count = z.number().int().min(0).max(1000000);
const level = z.enum(['N5','N4','N3','N2','N1']);
const moduleId = id.nullable().optional();
export const status = z.enum(['DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED']);
export const schemas = {
  levels: z.strictObject({level,title:text,titleJp:text,color:text,badge:text,description:text,totalVocab:count,totalKanji:count,totalGrammar:count,sortOrder:count.optional()}),
  modules: z.strictObject({levelId:id,unitNumber:id,title:text,titleJp:text,description:text,topics:z.array(text).min(1).max(100),sortOrder:count.optional()}),
  vocabulary: z.strictObject({moduleId,japanese:text,hiragana:optionalText,romaji:text,english:text,type:z.enum(['PHRASE','EXPRESSION','PRONOUN','VERB','ADJECTIVE','NOUN','ADVERB','PARTICLE']),level:level.nullable().optional(),lesson:optionalText,exampleJp:optionalText,exampleEn:optionalText}),
  kanji: z.strictObject({moduleId,character:z.string().trim().min(1).max(5),meaning:text,onyomi:optionalText,kunyomi:optionalText,level,strokeCount:id.nullable().optional(),radical:optionalText,exampleWords:z.array(z.strictObject({jp:text,en:text})).max(100).nullable().optional(),relatedChars:z.array(text).max(100).nullable().optional(),mnemonic:optionalText}),
  grammar: z.strictObject({moduleId,pattern:text,meaning:text,explanation:text,level,lesson:optionalText,textbook:optionalText,examples:z.array(z.strictObject({japanese:text,romaji:optionalText,english:text,sortOrder:count.optional()})).max(100).optional()}),
  quizzes: z.strictObject({moduleId:id,question:text,options:z.array(text).min(2).max(20),correctIndex:count,explanation:text,questionType:z.enum(['MULTIPLE_CHOICE','FILL_BLANK','TRUE_FALSE','MATCHING']).optional(),points:id.max(1000).optional()}),
  announcements: z.strictObject({title:text.max(500),content:text,type:z.enum(['INFO','WARNING','MAINTENANCE','UPDATE']).optional(),isActive:z.boolean().optional(),expiresAt:z.iso.datetime({offset:true}).nullable().optional()}),
};
export type Kind = keyof typeof schemas;
export const moduleUpdate = schemas.modules.partial().extend({contentStatus:status.optional(),version:id});
export const userStatus = z.strictObject({role:z.enum(['USER','MODERATOR','ADMIN']).optional(),isActive:z.boolean().optional()});
export const setting = z.strictObject({key:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_.-]{0,99}$/),value:z.string().max(20000),description:optionalText});
export function parse<T>(schema:z.ZodType<T>,input:unknown):T {
  const result=schema.safeParse(input);
  if(!result.success)throw new HttpError(400,'Invalid fields: '+result.error.issues.map(i=>i.path.join('.')||'body').slice(0,5).join(', '));
  return result.data;
}
export function contentInput(kind:Kind,input:unknown,update=false):Record<string,any> {
  const result=parse<Record<string,any>>(update ? kind==='modules' ? moduleUpdate : schemas[kind].partial() : schemas[kind],input);
  if(update && !Object.keys(result).some(k=>k!=='version'))throw new HttpError(400,'No changes supplied');
  if(kind==='quizzes' && result.correctIndex>=result.options.length)throw new HttpError(400,'Correct answer is outside options');
  if(kind==='announcements' && result.expiresAt)result.expiresAt=new Date(result.expiresAt).toISOString();
  return result;
}
