// SET PERCISION
precision mediump float;

// POSITION ATTRIBUTES
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

// MODEL MATRICIES
uniform mat4 uModelViewMatrix;      // Model View Matrix (Camera)
uniform mat4 uProjectionMatrix;     // Projection Matrix
uniform mat4 uNormalMatrix;         // Lighting Matrix

// TEXTURE & LIGHTING DATA
varying highp vec2 vTextureCoord;   // Object High Polygon Color
varying highp vec3 vLighting;       // Object High Polygon Lighting

// LIGHTING STATES
uniform bool isAmbientLighting;
uniform bool isDiffuseLighting;
uniform bool isSpecularLighting;
uniform bool isPhong;
uniform bool isExperimental;

uniform sampler2D materialTex;


// METHODS
/* Initiates Lighting Based on Lighting States */
void initLighting() {
    // Ambient Lighting
    if(isAmbientLighting) {
        float ambientStrength = 0.2;
        highp vec3 lightColor = vec3(1, 1, 1);
        vec3 light = ambientStrength * lightColor;

        vLighting = light;
    }

    // Experimental Lighting
    else if(isExperimental) {
        // Light Properties
        float intensityValue = 1.0;
        vec3 intensityVec = vec3(intensityValue, intensityValue, intensityValue);   // Intensity of R G B
        vec3 lightPos = vec3(0.0, 0.0, 1.0);

        // Camera Properties
        vec3 cameraPos = vec3(0.0, 0.0, 5.0);

        // Normals & Surfaces
        highp vec3 normal = mat3(uModelViewMatrix) * aVertexNormal;
        highp vec3 surfacePos = vec3(uModelViewMatrix * aVertexPosition);
        highp vec4 surfaceColor = texture2D(materialTex, aTextureCoord);
        highp vec3 surfaceToLight = normalize(lightPos - surfacePos);
        highp vec3 surfaceToCamera = normalize(cameraPos - surfacePos);

        // Ambient
        float ambientC = 1.0;     // Coefficient
        vec3 ambient = ambientC * surfaceColor.rgb * intensityVec;

        // Diffuse
        float diffuseC = max(0.0, dot(normal, surfaceToLight));
        vec3 diffuse = diffuseC * surfaceColor.rgb * intensityVec;

        // Specular
        float specularC = 0.0;
        float materialShininess = 5.0;
        if(diffuseC > 0.0) { specularC = pow(max(0.0, dot(surfaceToCamera, reflect(-surfaceToLight, normal))), materialShininess); }
        vec3 specularColor = vec3(1.0, 1.0, 1.0);       // RGB Values
        vec3 specular = specularC * specularColor * intensityVec;
        
        // Attenuation
        float distanceToLight = length(lightPos - surfacePos);
        float attenuationLight = 1.0;
        float attenuation = 1.0 / (1.0 + attenuationLight * pow(distanceToLight, 2.0));

        // Linear Color (Before Gamma Correction)
        vec3 linearColor = ambient + attenuation * (diffuse + specular);

        // Final Color (After Gamma Correction)
        vec3 gamma = vec3(1.0 / 2.2);

        vLighting = ambient + diffuse + specular + gamma;
    }

    // Init Default -> Ambient & Directional Lighting
    else {
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);                          // Ambient Lighting
        highp vec3 directionalLightColor = vec3(1, 1, 1);                       // Directional Light
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));        // Direction Vector for the Directional Light

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

        // Set Lighting Result
        vLighting = ambientLight + (directionalLightColor * directional);
    }
}

/* Initiates Default Object Location & Color/Textures 
 * 
 * Setup Object Position (Camera)
 * Setup Object Textures
 */
void initCamera() {
    // Set Object Location & Color/Texture
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}


// MAIN PROGRAM
void main() {
    // Initate Camera & Textures
    initCamera();

    // Set Lighting Based on Lighting States
    initLighting();
}