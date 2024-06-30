import { Component } from '@angular/core';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  template: `
  
  <div class="pageContainer">
      
      <div class="title">
        Hello! Welcome to our little guide
        <div class="line"></div>
      </div>
      <div class="container">
        <div class="card tabs">
          <input id="tab-1" type="radio" class="tab tab-selector" checked="checked" name="tab" />
          <label for="tab-1" class="tab tab-primary">What can I do?</label>
          <input id="tab-2" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-2" >How do icons work?</label>
          <input id="tab-3" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-3" >How does Stats work?</label>
          <input id="tab-4" type="radio" class="tab tab-selector" name="tab" />
          <label for="tab-4">What is exported?</label>
          
          <section class="content">
            <div class="item" id="content-1">
              <h2>Section 'Home'</h2>

              <p>In the <span>top side</span> you can see how much money you've spent/recieved/saved during the current month.On the <span>bottom right</span>
              you can see your last 4 entries for the current day with the option to see all entries on a paginated dialog!
              Your recurring entries that still havent taken place in the current month will show on the <span>bottom left.</span> This will also show you the remaing time for each of them.
              </p>
              <h2>What do the buttons do?</h2>
              <p>The first button you see is the <span>"Add a new entry"</span> one. With this, you can update your registry to reflect your current balance!
              You need to complete all the fields expect the <span>Pictogram</span> one but we strongly recommend you use one so we can offer more feedback in the <span>Stats page</span>
              </p>
              
            </div>
            <div class="item" id="content-2">
              <h2>The pictograms</h2>
              <p>We offer a collection of different pictograms and categories that will help you categorize your entries better while making the experience more friendly too!
                 Don't worry! You can delete the existing ones and you can add your own. <span>(png,jpg or gif within the size limit)</span>Deleting them won't delete the entries for which they were selected so you dont have to worry about that either!
              </p>
              <h2>Inserting new ones</h2>
              <p>While you have the freedom to choose whatever you wish, we strongly recommend using the png ones! We also give you the possibility to insert new categories but keep in mind
                not to overcrowd the interface with unnecessary ones!  </p>
            </div>
            <div class="item" id="content-3">
              <h2>The data we use</h2>
              <p>In the <span>Stats page</span> we will show you the <span>summary for the current month </span>. We will show you the total sum of your spendings/income/savings using different data visualisation methods
              Currently we only use the data for the current month and compare it to the previous one. We will also offer the option to select other months

              </p>
            </div>
            <div class="item" id="content-4">
              <h2>Type supported</h2>
              <p>Currently we offer the <span>pdf</span> and the <span>csv</span> format so you can export your registry entries!</p>
            </div>
          </section>
    
        </div>
      </div>
    </div>
 
  `,
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {

}
