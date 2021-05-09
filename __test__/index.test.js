describe('Games', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/space_invaders');
    });
  
    it('should be titled "Games"', async () => {
      await expect(page.title()).resolves.toMatch('Games');
    });
  });