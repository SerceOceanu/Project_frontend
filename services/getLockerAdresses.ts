export async function getLockerAdresses(){
  try {
    
    const response = await fetch("https://api-inpost.easypack24.net/v4/machines?type=parcel_locker", {
      cache: 'no-store', // or next: { revalidate: 3600 } for caching
    })
    console.log(response, 'response')
    if (!response.ok) {
      throw new Error(`Failed to fetch locker addresses: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
