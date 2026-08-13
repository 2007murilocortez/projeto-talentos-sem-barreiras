import { describe, expect, it } from 'vitest';

import { fail, fromPromise, isFail, isOk, mapResult, ok, unwrapOr } from '@/shared/lib/result';

describe('Result', () => {
  it('carrega o valor no sucesso', () => {
    const result = ok(42);

    expect(isOk(result)).toBe(true);
    expect(result.ok && result.value).toBe(42);
  });

  it('carrega o erro na falha', () => {
    const result = fail('vaga-encerrada');

    expect(isFail(result)).toBe(true);
    expect(!result.ok && result.error).toBe('vaga-encerrada');
  });

  it('transforma apenas o sucesso', () => {
    expect(mapResult(ok(2), (n) => n * 3)).toEqual(ok(6));
    expect(mapResult(fail<string>('erro'), (n: number) => n * 3)).toEqual(fail('erro'));
  });

  it('usa o padrão quando houve falha', () => {
    expect(unwrapOr(ok('perfil'), 'vazio')).toBe('perfil');
    expect(unwrapOr(fail<string>('erro'), 'vazio')).toBe('vazio');
  });

  it('converte promessa resolvida em sucesso', async () => {
    await expect(fromPromise(Promise.resolve('ok'), () => 'erro')).resolves.toEqual(ok('ok'));
  });

  it('converte promessa rejeitada em falha, sem propagar a exceção', async () => {
    const result = await fromPromise(Promise.reject(new Error('rede')), (cause) =>
      cause instanceof Error ? cause.message : 'desconhecido'
    );

    expect(result).toEqual(fail('rede'));
  });
});
