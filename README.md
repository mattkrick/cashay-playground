# cashay-playground
really boring &amp; uninteresting &amp; definitely not click worthy

## Installation
- `git clone https://github.com/mattkrick/cashay-playground.git`
- `npm i && npm start`

## Things to do in the playground
- Server calls are delayed by 1 second to see all the optimistic goodness
- Notice that checking loading status is really, really easy
- Click "get 2 more" and notice that the button goes away after you've got em all without a 2nd request to the server.
- Click "show comments" on the first post to see 2 comments load
- Add a comment & notice that you can add it ***anywhere in the array*** (in this case, it's sorted by karma & starts you out at 0)
- Add a post & notice that the optimistic update is immediate & the response from the server corrects what you optimistically guessed
- Adding a post updates the array _and_ the post count
- Crack open the Chrome Redux Devtools and take a look at your sexy, sexy store

## Things to notice in the code
- I never wrote a single mutation
- For most mutations, you don't even need to include a `components` options, it'll just grab all the queries with the corresponding handlers
- Your mutation handler can do ANYTHING. seriously, ANYTHING
