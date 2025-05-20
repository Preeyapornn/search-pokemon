import { mockPokemons } from '../__mocks__/pokemonMock';

describe('Pokemon type checking', () => {
    it('Bulbasaur should be Grass type', () => {
        expect(mockPokemons.Bulbasaur.types).toContain('Grass');
    });

    it('Charmander should be Fire type', () => {
        expect(mockPokemons.Charmander.types).toContain('Fire');
    });

    it('Squirtle should be Water type', () => {
        expect(mockPokemons.Squirtle.types).toContain('Water');
    });
});