import { Component } from '@angular/core';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  template: `
  
<div class = "wrapper pre">
  
  </div>
  <div class="pageContainer">
    <div class="wrapper">
      <div class="title">
        CSS Tabs
        <div class="line"></div>
      </div>
      <div class="container">
        <div class="card tabs">
          <input id="tab-1" type="radio" class="tab tab-selector" checked="checked" name="tab" />
          <label for="tab-1" class="tab tab-primary">Product</label>
          <input id="tab-2" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-2" class="tab tab-success">Options</label>
          <input id="tab-3" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-3" class="tab tab-default">Shipping</label>
          <input id="tab-4" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-4" class="tab tab-warning">Published</label>
          <div class="tabsShadow"></div>
          <div class="glider"></div>
          <section class="content">
            <div class="item" id="content-1">
              <h2 class="tab-title tab-primary">Sweep + Slide Dog Toy</h2>
              <p>
                <span class = "numit">1</span> The Sweep + Slide is an indoor dog toy with a sleek base designed to glide across any floor. Not only does this toy stimulate your dog's natural chase instincts, but it also sweeps away floor dust and grime with a replaceable sweeper bottom cover.
              </p>
            </div>
            <div class="item" id="content-2">
              <h2 class="tab-title tab-success">Tab 2</h2>
              <p>
                <span class = "numit">2</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor </p>
            </div>
            <div class="item" id="content-3">
              <h2 class="tab-title tab-default">Tab 3</h2>
              <p>
                <span class = "numit">3</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis </p>
            </div>
            <div class="item" id="content-4">
              <h2 class="tab-title tab-warning">Tab 4</h2>
              <p>
                <span class = "numit">4</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </section>
    
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {

}
