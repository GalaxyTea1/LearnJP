export interface CourseModule {
  id: number; title: string; titleJp?: string; description?: string; topics?: string[]; unitNumber: number; contentStatus: string;
  level: { level: string }; status: string; progressPercent: number;
  _count: { vocabulary: number; kanji: number; grammarPatterns: number; quizQuestions: number };
}
export function summarizeCourse(modules: CourseModule[], level: string) {
  const published = modules.filter(m => m.contentStatus === 'PUBLISHED' && m.level.level === level).sort((a, b) => a.unitNumber - b.unitNumber);
  return {
    modules: published, count: published.length,
    vocabulary: published.reduce((n, m) => n + m._count.vocabulary, 0),
    kanji: published.reduce((n, m) => n + m._count.kanji, 0),
    grammar: published.reduce((n, m) => n + m._count.grammarPatterns, 0),
    completed: published.filter(m => m.status === 'COMPLETED').length,
    next: published.find(m => m.status === 'IN_PROGRESS') ?? published.find(m => m.status === 'NOT_STARTED'),
  };
}

export interface CatalogProgress { moduleId: number; status: string; progressPercent: number }
export function mergeCatalogProgress(modules: CourseModule[], progress: CatalogProgress[] | null, guest: boolean): CourseModule[] {
  const byModule = new Map((progress ?? []).map(p => [p.moduleId, p]));
  return modules.map(module => {
    const saved = byModule.get(module.id);
    return { ...module, status: guest ? 'NOT_STARTED' : progress === null ? 'UNKNOWN' : saved?.status ?? 'NOT_STARTED', progressPercent: guest || progress === null ? 0 : saved?.progressPercent ?? 0 };
  });
}
