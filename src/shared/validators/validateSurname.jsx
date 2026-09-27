export const validateSurname = (surname) => {
    const regex = /^[^\s]{1}[A-Za-zÁ-ÿ\u00f1\u00d1\s]{1,23}[^\s]{1}$/

    return regex.test(surname.trim()) 
}

export const validateSurnameMessage = 'El apellido debe contener entre 3 y 25 caracteres'