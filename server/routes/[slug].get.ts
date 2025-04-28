import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const userAgent = event.node.req.headers['user-agent'] || ''
  const isBot = /facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(userAgent)

  const slug = event.context.params!.slug
  const key = `${slug}` //Should be dynamic but in this case we don't need that

  console.log("SLUG: " ,slug)

  const metaPath = join(process.cwd(), 'server/data/og-meta.json')
  const metaRaw = await readFile(metaPath, 'utf8')
  const meta = JSON.parse(metaRaw)

  const page = meta[key]

  if (isBot) {
    const ogHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta property="og:title" content="${page.title}" />
        <meta property="og:description" content="${page.description}" />
        <meta property="og:image" content="${page.image}" />
        <meta property="og:url" content="${page.url}" />
        <title>${page.title}</title>
      </head>
      <body>
        Redirecting...
         <script>window.location.href="${page.url}";</script>
      </body>
      </html>
    `
    return new Response(ogHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }

  // Only redirect if needed
  if (page.url == `/`) {
    
  }


})
