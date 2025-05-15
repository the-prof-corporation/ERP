export class NotFoundPage {
  render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
      </div>
    `;
    return container;
  }
}
