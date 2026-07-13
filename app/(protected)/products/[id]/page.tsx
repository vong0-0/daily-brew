export default async function ProductDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <h1>Product Detail</h1>
      <p>{id}</p>
    </div>
  )
}