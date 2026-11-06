const SUPABASE_URL = "https://fglmqmqextpbohkyraie.supabase.co";

const SUPABASE_KEY = "sb_publishable_gdIl2oGmsr1ZOLK4sBPsng_FluvmxRO";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("bookForm");
const booksDiv = document.getElementById("books");

let editingId = null;

async function cargarLibros() {

    const { data, error } = await supabaseClient
        .from("libros")
        .select("*")
        .order("id");

    if(error){
        console.error(error);
        return;
    }

    booksDiv.innerHTML = "";

    data.forEach(libro => {

        booksDiv.innerHTML += `
            <div class="book">
                <h3>${libro.titulo}</h3>

                <p><strong>Autor:</strong> ${libro.autor}</p>

                <p><strong>Categoría:</strong> ${libro.categoria}</p>

                <p><strong>Año:</strong> ${libro.anio}</p>

                <button onclick="editarLibro(${libro.id})">
                    Editar
                </button>

                <button onclick="eliminarLibro(${libro.id})">
                    Eliminar
                </button>

                <button onclick="verLibro(${libro.id})">
                    Ver
                </button>
            </div>
        `;
    });

}

async function verLibro(id){

    const { data } = await supabaseClient
        .from("libros")
        .select("*")
        .eq("id", id)
        .single();

    alert(
        `Título: ${data.titulo}
Autor: ${data.autor}
Categoría: ${data.categoria}
Año: ${data.anio}`
    );
}

async function editarLibro(id){

    const { data } = await supabaseClient
        .from("libros")
        .select("*")
        .eq("id", id)
        .single();

    document.getElementById("titulo").value =
        data.titulo;

    document.getElementById("autor").value =
        data.autor;

    document.getElementById("categoria").value =
        data.categoria;

    document.getElementById("anio").value =
        data.anio;

    editingId = id;
}

async function eliminarLibro(id){

    await supabaseClient
        .from("libros")
        .delete()
        .eq("id", id);

    cargarLibros();
}

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const libro = {

        titulo:
            document.getElementById("titulo").value,

        autor:
            document.getElementById("autor").value,

        categoria:
            document.getElementById("categoria").value,

        anio:
            parseInt(
                document.getElementById("anio").value
            )
    };

    if(editingId){

        await supabaseClient
            .from("libros")
            .update(libro)
            .eq("id", editingId);

        editingId = null;

    } else {

        await supabaseClient
            .from("libros")
            .insert([libro]);
    }

    form.reset();

    cargarLibros();
});

cargarLibros();
